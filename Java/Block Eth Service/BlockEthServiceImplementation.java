package BlockEthServce;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.ComparisonOperators;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBObject;
import com.okane.zazen.DTO.BlockTransactionsDTO;
import com.okane.zazen.Service.BlockEthService;
import com.okane.zazen.Utils.AggregationResultToBlockResponseDTOMapper;

/**
 * Service for Block Service which implements {@link BlockEthService} interface
 */
@Service
public class BlockEthServiceImplementation implements BlockEthService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private AggregationResultToBlockResponseDTOMapper mapper;

  /**
   * Provides a summary of transactions for an address, grouped by block
   *
   * @param address
   * @param startingBlockNumber
   * @param endingBlockNumber
   * @return {@link List} of {@link BlockTransactionsDTO}
   */
  @Override
  public List<BlockTransactionsDTO> getBlockTransactionSummaries(String address, String startingBlockNumber,
      String endingBlockNumber) {

    /**
     * In this code, we are going to write a pipeline, which will have multiple
     * stages to perform a specific operation, this pipeline will be sent to mongo
     * to perform all the operations and return only the desired response
     */

    // Initial criteria to match address, either to or from
    Criteria criteria = new Criteria().orOperator(
        Criteria.where("Transaction Data.to").is(address),
        Criteria.where("Transaction Data.from").is(address));

    List<AggregationOperation> aggregationPipeline = new ArrayList<>();
    aggregationPipeline.add(Aggregation.match(criteria));

    /**
     * Additional criteria based on option fields startingBlockNumber and
     * endingBlockNumber
     */
    if (startingBlockNumber != null || endingBlockNumber != null) {
      List<Criteria> blockNumberCriteriaList = new ArrayList<>();
      if (startingBlockNumber != null) {
        blockNumberCriteriaList.add(
            Criteria.where("Transaction Data.blockNumber").gte(startingBlockNumber));
      }
      if (endingBlockNumber != null) {
        blockNumberCriteriaList.add(
            Criteria.where("Transaction Data.blockNumber").lte(endingBlockNumber));
      }

      // Add criterias with and operator
      Criteria blockNumberCriteria = new Criteria().andOperator(blockNumberCriteriaList.toArray(new Criteria[0]));
      aggregationPipeline.add(Aggregation.match(blockNumberCriteria));
    }

    // This stage extract required information from collection
    aggregationPipeline.add(Aggregation.group("Transaction Data.blockNumber")
        .addToSet(new BasicDBObject(
            "hash", "$Transaction hash")
            .append("value",
                "$Transaction Data.value")
            .append("to", "$Transaction Data.to")
            .append("from", "$Transaction Data.from"))
        .as("data"));

    // Unwind the data to do our operation on it
    aggregationPipeline.add(Aggregation.unwind("$data"));

    // This stage has the logic to count the txns based on to and from
    aggregationPipeline.add(Aggregation.group("_id")
        .push("data.hash").as("txns")
        .count().as("numTxns")

        // Condition to count txns for numTxnsReceived or numTxnsSent
        .sum(ConditionalOperators.when(ComparisonOperators.valueOf("data.to").equalToValue(address))
            .then(1).otherwise(0))
        .as("numTxnsReceived")
        .sum(ConditionalOperators.when(ComparisonOperators.valueOf("data.from").equalToValue(address))
            .then(1).otherwise(0))
        .as("numTxnsSent")

        // Condition to put values inside totalValueSent or totalValueReceived
        .push(
            ConditionalOperators.when(
                ComparisonOperators.Eq.valueOf("data.from").equalToValue(address))
                .then("$data.value").otherwise("$REMOVE"))
        .as("totalValueSent")
        .push(
            ConditionalOperators.when(
                ComparisonOperators.Eq.valueOf("data.to").equalToValue(address))
                .then("$data.value").otherwise("$REMOVE"))
        .as("totalValueReceived"));

    // Once everything is ready, project as per our response
    aggregationPipeline.add(Aggregation
        .project("_id", "txns", "numTxns", "numTxnsReceived", "numTxnsSent", "totalValueSent",
            "totalValueReceived")
        .and("_id").as("blockNumber")
        .and("txns").as("txns")
        .and("numTxns").as("numTxns")
        .and("numTxnsReceived").as("numTxnsReceived")
        .and("numTxnsSent").as("numTxnsSent")
        .and("totalValueSent").as("totalValueSent")
        .and("totalValueReceived").as("totalValueReceived"));

    // Finalize the pipeline
    Aggregation aggregation = Aggregation.newAggregation(aggregationPipeline);

    // Query mongo with our pipeline
    List<Document> aggregationResult = mongoTemplate.aggregate(aggregation, "transactions_eth", Document.class)
        .getMappedResults();

    // Finally return the results after mapping
    return mapper.mapAggregationResult(aggregationResult);

  }
}
