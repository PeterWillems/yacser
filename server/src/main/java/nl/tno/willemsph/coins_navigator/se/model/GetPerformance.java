package nl.tno.willemsph.coins_navigator.se.model;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.jena.query.ParameterizedSparqlString;

import com.fasterxml.jackson.databind.JsonNode;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.sparql.EmbeddedServer;

public class GetPerformance extends GetSeObject {

	public GetPerformance() {
	}

	public GetPerformance(SeService seService, int datasetId, String uri) throws URISyntaxException {
		super(seService, datasetId, uri);
	}

	public URI getValue() throws IOException, URISyntaxException {
		URI valueUri = null;
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("performance", getUri().toString());
		queryStr.append("SELECT ?value ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("      ?performance se:value ?value . ");
		queryStr.append("      OPTIONAL { ?value coins2:datatypeValue ?datatype_value . } ");
		queryStr.append("  }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		for (JsonNode node : responseNodes) {
			JsonNode valueNode = node.get("value");
			String value = valueNode != null ? valueNode.get("value").asText() : null;
			valueUri = value != null ? new URI(value) : null;
		}
		return valueUri;
	}
	
	public void deleteValue() throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("performance", getUri().toString());

		queryStr.append("  DELETE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      ?performance se:value ?value . ");
		queryStr.append("    } ");
		queryStr.append("  } ");
		queryStr.append("  WHERE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      { ");
		queryStr.append("        ?performance se:value ?value . ");
		queryStr.append("      } ");
		queryStr.append("    }");
		queryStr.append("  }");

		getEmbeddedServer().update(queryStr);
	}

	public void insertValue(URI value) throws IOException, URISyntaxException {
		if (value != null) {
			ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("performance", getUri().toString());
			queryStr.setIri("value", value.toString());
			queryStr.append("  INSERT { ");
			queryStr.append("    GRAPH ?graph { ");
			queryStr.append("      ?performance se:value ?value . ");
			queryStr.append("    } ");
			queryStr.append("  }");
			queryStr.append("WHERE { } ");

			getEmbeddedServer().update(queryStr);
		}
	}
	
	public void updateValue(URI value) throws IOException, URISyntaxException {
		deleteValue();
		insertValue(value);
	}

	public void delete() throws IOException, URISyntaxException {
		super.delete();
	}

	public void update(PutPerformance putPerformance) throws IOException, URISyntaxException {
		super.update(putPerformance);
		updateValue(putPerformance.getValue());
	}

	public static GetPerformance create(SeService seService, int datasetId, String uri)
			throws URISyntaxException, IOException {
		GetPerformance performance = new GetPerformance(seService, datasetId, uri);
		performance.create();
		return performance;
	}

	@Override
	public String containsRelation() {
		return EmbeddedServer.SE + "ContainsPerformance";
	}
}
