package nl.tno.willemsph.coins_navigator.se.model;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import javax.xml.bind.DatatypeConverter;

import org.apache.jena.query.ParameterizedSparqlString;

import com.fasterxml.jackson.databind.JsonNode;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.sparql.EmbeddedServer;

public class GetSeObject {

	private SeService seService;
	private int datasetId;
	private URI uri;

	public GetSeObject() {
	}

	public GetSeObject(SeService seService, int datasetId, String uri) throws URISyntaxException {
		this.seService = seService;
		this.datasetId = datasetId;
		this.uri = new URI(uri);
	}

	public URI getUri() {
		return uri;
	}

	public void setUri(URI uri) {
		this.uri = uri;
	}

	public String getLabel() throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("se_object", this.uri.toString());
		queryStr.append("SELECT ?label ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?se_object rdfs:label ?label . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");
		queryStr.append("ORDER BY ?label");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		if (responseNodes.size() > 0) {
			JsonNode labelNode = responseNodes.get(0).get("label");
			return labelNode != null ? labelNode.get("value").asText() : null;
		}
		return null;
	}

	public void updateLabel(String label) throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("subject", getUri().toString());
		queryStr.setLiteral("new_label", label);
		queryStr.append("  DELETE { GRAPH ?graph { ?subject rdfs:label ?label }} ");
		queryStr.append("  INSERT { GRAPH ?graph { ?subject rdfs:label ?new_label }} ");
		queryStr.append("WHERE { GRAPH ?graph { OPTIONAL { ?subject rdfs:label ?label }} ");
		queryStr.append("}");

		getEmbeddedServer().update(queryStr);
	}

	public URI getAssembly() throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("se_object", this.uri.toString());
		queryStr.append("SELECT ?assembly ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasPart ?se_object . ");
		queryStr.append("      ?assembly coins2:hasContainsRelation ?contains . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasPart ?se_object . ");
		queryStr.append("      ?contains coins2:hasAssembly ?assembly . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?assembly coins2:hasContainsRelation ?contains . ");
		queryStr.append("      ?se_object coins2:partOf ?contains . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasAssembly ?assembly . ");
		queryStr.append("      ?se_object coins2:partOf ?contains . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");
		queryStr.append("ORDER BY ?assembly");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		if (responseNodes.size() > 0) {
			JsonNode assemblyNode = responseNodes.get(0).get("assembly");
			String assemblyUri = assemblyNode != null ? assemblyNode.get("value").asText() : null;
			return assemblyUri != null ? new URI(assemblyUri) : null;
		}
		return null;
	}

	public void updateAssembly(URI assembly) throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri().toString());
		queryStr.setIri("subject", this.uri.toString());

		queryStr.append("  DELETE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      ?c ?p1 ?o1 . ");
		queryStr.append("      ?o2 ?p2 ?c . ");
		queryStr.append("    } ");
		queryStr.append("  } ");
		queryStr.append("  WHERE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        OPTIONAL { ?o2 ?p2 ?c . } ");
		queryStr.append("        ?c coins2:hasPart ?subject . ");
		queryStr.append("        ?c coins2:hasAssembly ?assembly . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?subject coins2:partOf ?c . ");
		queryStr.append("        ?c coins2:hasAssembly ?assembly . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?c coins2:hasPart ?subject . ");
		queryStr.append("        ?assembly coins2:hasContainsRelation ?c . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?subject coins2:partOf ?c . ");
		queryStr.append("        ?assembly coins2:hasContainsRelation ?c . ");
		queryStr.append("      } ");
		queryStr.append("    }");
		queryStr.append("  }");

		getEmbeddedServer().update(queryStr);

		if (assembly != null) {
			String containsRelationUri = getDatasetUri() + "#ContainsRelation_" + UUID.randomUUID().toString();
			queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("subject", this.uri.toString());
			queryStr.setIri("contains_relation", containsRelationUri);
			queryStr.setIri("contains_relation_type", containsRelation());
			queryStr.setIri("assembly", assembly.toString());
			queryStr.append("  INSERT { ");
			queryStr.append("    GRAPH ?graph { ");
			queryStr.append("      ?contains_relation rdf:type ?contains_relation_type . ");
			queryStr.append("      ?contains_relation rdf:type coins2:CoinsContainerObject . ");
			queryStr.append("      ?contains_relation coins2:hasAssembly ?assembly . ");
			queryStr.append("      ?contains_relation coins2:hasPart ?subject . ");
			queryStr.append("    } ");
			queryStr.append("  }");
			queryStr.append("WHERE { } ");

			getEmbeddedServer().update(queryStr);
		}
	}

	public List<URI> getParts() throws URISyntaxException, IOException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("assembly", this.uri.toString());
		queryStr.append("SELECT ?part ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasPart ?part . ");
		queryStr.append("      ?assembly coins2:hasContainsRelation ?contains . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasPart ?part . ");
		queryStr.append("      ?contains coins2:hasAssembly ?assembly . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?assembly coins2:hasContainsRelation ?contains . ");
		queryStr.append("      ?part coins2:partOf ?contains . ");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?contains coins2:hasAssembly ?assembly . ");
		queryStr.append("      ?part coins2:partOf ?contains . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		List<URI> parts = new ArrayList<>();
		for (JsonNode node : responseNodes) {
			JsonNode partNode = node.get("part");
			if (partNode != null) {
				String partUri = partNode.get("value").asText();
				parts.add(new URI(partUri));
			}
		}
		return parts;
	}

	public void deleteParts() throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("subject", getUri().toString());

		queryStr.append("  DELETE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      ?c ?p1 ?o1 . ");
		queryStr.append("      ?o2 ?p2 ?c . ");
		queryStr.append("    } ");
		queryStr.append("  } ");
		queryStr.append("  WHERE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        OPTIONAL { ?o2 ?p2 ?c . } ");
		queryStr.append("        ?c coins2:hasPart ?part . ");
		queryStr.append("        ?c coins2:hasAssembly ?subject . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?part coins2:partOf ?c . ");
		queryStr.append("        ?c coins2:hasAssembly ?subject . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?c coins2:hasPart ?part . ");
		queryStr.append("        ?subject coins2:hasContainsRelation ?c . ");
		queryStr.append("      } UNION { ");
		queryStr.append("        ?c ?p1 ?o1 . ");
		queryStr.append("        ?o2 ?p2 ?c . ");
		queryStr.append("        ?part coins2:partOf ?c . ");
		queryStr.append("        ?subject coins2:hasContainsRelation ?c . ");
		queryStr.append("      } ");
		queryStr.append("    }");
		queryStr.append("  }");

		getEmbeddedServer().update(queryStr);
	}

	public void insertParts(List<URI> parts) throws IOException, URISyntaxException {
		if (parts != null) {
			for (URI part : parts) {
				insertPart(part);
			}
		}
	}

	private void insertPart(URI partUri) throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		if (partUri != null) {
			String containsRelationUri = getDatasetUri() + "#ContainsRelation_" + UUID.randomUUID().toString();
			queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("subject", getUri().toString());
			queryStr.setIri("contains_relation", containsRelationUri);
			queryStr.setIri("contains_relation_type", containsRelation());
			queryStr.setIri("part", partUri.toString());
			queryStr.append("  INSERT { ");
			queryStr.append("    GRAPH ?graph { ");
			queryStr.append("      ?contains_relation rdf:type ?contains_relation_type . ");
			queryStr.append("      ?contains_relation rdf:type coins2:CoinsContainerObject . ");
			queryStr.append("      ?contains_relation coins2:hasAssembly ?subject . ");
			queryStr.append("      ?contains_relation coins2:hasPart ?part . ");
			queryStr.append("    } ");
			queryStr.append("  }");
			queryStr.append("WHERE { } ");

			getEmbeddedServer().update(queryStr);
		}
	}

	public void delete() throws IOException, URISyntaxException {
		updateAssembly(null);
		deleteParts();
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("subject", getUri().toString());

		queryStr.append("  DELETE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      ?subject ?p1 ?o1 . ");
		queryStr.append("      ?o2 ?p2 ?subject . ");
		queryStr.append("    } ");
		queryStr.append("  } ");
		queryStr.append("  WHERE { ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("        ?subject ?p1 ?o1 . ");
		queryStr.append("        OPTIONAL { ?o2 ?p2 ?subject . } ");
		queryStr.append("    }");
		queryStr.append("  }");

		getEmbeddedServer().update(queryStr);
	}

	public void update(PutSeObject putSeObject) throws IOException, URISyntaxException {
		updateCoinsObject(putSeObject.getCoinsObject());
		updateLabel(putSeObject.getLabel());
		updateAssembly(putSeObject.getAssembly());
		deleteParts();
		insertParts(putSeObject.getParts());
	}

	protected EmbeddedServer getEmbeddedServer() throws IOException, URISyntaxException {
		return SeService.getEmbeddedServer();
	}

	protected String getDatasetUri() throws URISyntaxException, IOException {
		// return
		// getEmbeddedServer().getDatasets().get(this.datasetId).getUri().toString();
		return getEmbeddedServer().exampleDatasets.get(this.datasetId).getUri().toString();
	}

	protected String getOntologyUri() throws URISyntaxException, IOException {
		return this.seService.getOntologyUri(this.datasetId);
	}

	protected String generateUri() throws URISyntaxException, IOException {
		String localName = getClass().getSimpleName() + "_" + UUID.randomUUID().toString();
		return this.seService.getOntologyUri(datasetId) + "#" + localName;
	}

	public String getLocalName() {
		if (uri != null) {
			String uriString = uri.toString();
			int indexOfHashMark = uriString.indexOf('#');
			return uriString.substring(indexOfHashMark + 1);
		}
		return null;
	}

	public void create() throws URISyntaxException, IOException {
		String label = getLocalName().substring(0, getClass().getSimpleName().length() + 2);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("se_object", getUri().toString());
		queryStr.setIri("SeObject", EmbeddedServer.SE + getClass().getSimpleName().substring(3));
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setLiteral("label", label);
		queryStr.setLiteral("now", Calendar.getInstance());
		queryStr.append("INSERT {");
		queryStr.append("  GRAPH ?graph {");
		queryStr.append("    ?se_object rdf:type ?SeObject .");
		queryStr.append("    ?se_object rdf:type coins2:CoinsContainerObject .");
		queryStr.append("    ?se_object rdfs:label ?label .");
		queryStr.append("    ?se_object coins2:name ?label .");
		queryStr.append("    ?se_object coins2:creationDate ?now .");
		queryStr.append("  }");
		queryStr.append("}");
		queryStr.append("WHERE {");
		queryStr.append("}");

		getEmbeddedServer().update(queryStr);
	}

	public String containsRelation() {
		return EmbeddedServer.COINS2 + "ContainsRelation";
	}

	public CoinsObject getCoinsObject() throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("se_object", this.uri.toString());
		queryStr.append("SELECT ?name ?userID ?description ?creationDate ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?se_object coins2:name ?name .");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?se_object coins2:userID ?userID .");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?se_object coins2:description ?description .");
		queryStr.append("    }");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?se_object coins2:creationDate ?creationDate .");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		CoinsObject coinsObject = new CoinsObject();
		if (responseNodes.size() > 0) {
			JsonNode nameNode = responseNodes.get(0).get("name");
			coinsObject.setName(nameNode != null ? nameNode.get("value").asText() : null);
			JsonNode userIDNode = responseNodes.get(0).get("userID");
			coinsObject.setUserID(userIDNode != null ? userIDNode.get("value").asText() : null);
			JsonNode descriptionNode = responseNodes.get(0).get("description");
			coinsObject.setDescription(descriptionNode != null ? descriptionNode.get("value").asText() : null);
			JsonNode creationDateNode = responseNodes.get(0).get("creationDate");
			// coinsObject.setCreationDate(
			// creationDateNode != null ?
			// Date.from(Instant.parse(creationDateNode.get("value").asText())) : null);
			coinsObject.setCreationDate(creationDateNode != null ? creationDateNode.get("value").asText() : null);
		}

		queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", getDatasetUri());
		queryStr.setIri("se_object", this.uri.toString());
		queryStr.append(
				"SELECT ?propertyRsrc ?propertyType ?superPropertyType ?predicate ?p ?propertyValue ?name ?userID ?description ?creationDate ");
		queryStr.append("{");
		queryStr.append("  OPTIONAL {");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      ?se_object coins2:hasProperties ?propertyRsrc . ");
		queryStr.append("      ?propertyRsrc rdf:type ?propertyType . ");
		queryStr.append("    }");
		queryStr.append("    ?propertyType rdfs:subClassOf+ ?superPropertyType . ");
		queryStr.append(
				"      FILTER (?superPropertyType = coins2:ComplexProperty || ?superPropertyType = coins2:SimpleProperty) ");
		queryStr.append(
				"      BIND (IF (?superPropertyType = coins2:ComplexProperty, coins2:objectValue,  coins2:datatypeValue) AS ?predicate) ");
		queryStr.append("    GRAPH ?graph { ");
		queryStr.append("      OPTIONAL {");
		queryStr.append("        ?propertyRsrc ?predicate ?propertyValue .");
		queryStr.append("      }");
		queryStr.append("      OPTIONAL {");
		queryStr.append("        ?propertyRsrc coins2:name ?name .");
		queryStr.append("      }");
		queryStr.append("      OPTIONAL {");
		queryStr.append("        ?propertyRsrc coins2:userID ?userID .");
		queryStr.append("      }");
		queryStr.append("      OPTIONAL {");
		queryStr.append("        ?propertyRsrc coins2:description ?description .");
		queryStr.append("      }");
		queryStr.append("      OPTIONAL {");
		queryStr.append("        ?propertyRsrc coins2:creationDate ?creationDate .");
		queryStr.append("      }");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");

		responseNodes = getEmbeddedServer().query(queryStr);
		List<CoinsProperty> coinsProperties = new ArrayList<>();
		int index = 0;
		List<String> names = new ArrayList<>();
		for (JsonNode jsonNode : responseNodes) {
			JsonNode propertyTypeNode = jsonNode.get("propertyType");
			if (propertyTypeNode != null) {
				CoinsProperty coinsProperty = new CoinsProperty();
				String propertyType = propertyTypeNode.get("value").asText();
				coinsProperty.setType(new URI(propertyType));
				JsonNode propertyRsrcNode = jsonNode.get("propertyRsrc");
				String propertyRsrcType = propertyRsrcNode != null ? propertyRsrcNode.get("type").asText() : null;
				coinsProperty.setPropertyRsrcType(propertyRsrcType);
				JsonNode valueRsrcNode = jsonNode.get("propertyValue");
				String valueRsrcType = valueRsrcNode != null ? valueRsrcNode.get("type").asText() : null;
				coinsProperty.setValueRsrcType(valueRsrcType);
				// JsonNode propertyValueNode = jsonNode.get("propertyValue");
				Object propertyValue = valueRsrcNode != null ? valueRsrcNode.get("value").asText() : null;
				coinsProperty.setValue(propertyValue);
				JsonNode nameNode = responseNodes.get(index).get("name");
				coinsProperty.setName(nameNode != null ? nameNode.get("value").asText() : null);
				if (!names.contains(coinsProperty.getName())) {
					names.add(coinsProperty.getName());
					coinsProperties.add(coinsProperty);
				}
				JsonNode userIDNode = responseNodes.get(index).get("userID");
				coinsProperty.setUserID(userIDNode != null ? userIDNode.get("value").asText() : null);
				JsonNode descriptionNode = responseNodes.get(index).get("description");
				coinsProperty.setDescription(descriptionNode != null ? descriptionNode.get("value").asText() : null);
				JsonNode creationDateNode = responseNodes.get(index).get("creationDate");
				// coinsObject.setCreationDate(
				// creationDateNode != null ?
				// Date.from(Instant.parse(creationDateNode.get("value").asText())) : null);
				coinsProperty.setCreationDate(creationDateNode != null ? creationDateNode.get("value").asText() : null);
			}
			index++;
		}
		if (!coinsProperties.isEmpty()) {
			coinsObject.setHasProperties(coinsProperties);
		}
		return coinsObject;
	}

	public void updateCoinsObject(CoinsObject coinsObject) throws IOException, URISyntaxException {
		if (coinsObject != null) {
			ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("subject", getUri().toString());
			queryStr.append("  DELETE { GRAPH ?graph { ");
			queryStr.append("    ?subject coins2:name ?name . ");
			queryStr.append("    ?subject coins2:userID ?userID . ");
			queryStr.append("    ?subject coins2:description ?description . ");
			queryStr.append("    ?subject coins2:creationDate ?creationDate . ");
			queryStr.append("  }} ");
			queryStr.append("  INSERT { GRAPH ?graph { ");
			if (coinsObject.getName() != null) {
				queryStr.setLiteral("new_name", coinsObject.getName());
				queryStr.append("    ?subject coins2:name ?new_name . ");
			}
			if (coinsObject.getUserID() != null) {
				queryStr.setLiteral("new_userID", coinsObject.getUserID());
				queryStr.append("    ?subject coins2:userID ?new_userID . ");
			}
			if (coinsObject.getDescription() != null) {
				queryStr.setLiteral("new_description", coinsObject.getDescription());
				queryStr.append("    ?subject coins2:description ?new_description . ");
			}
			if (coinsObject.getCreationDate() != null) {
				Calendar dateTime = DatatypeConverter.parseDateTime(coinsObject.getCreationDate());
				queryStr.setLiteral("new_creationDate", dateTime);
				queryStr.append("    ?subject coins2:creationDate ?new_creationDate . ");
			}
			queryStr.append("  }} ");
			queryStr.append("WHERE { GRAPH ?graph { ");
			queryStr.append("  OPTIONAL { ?subject coins2:name ?name . }");
			queryStr.append("  OPTIONAL { ?subject coins2:userID ?userID . }");
			queryStr.append("  OPTIONAL { ?subject coins2:description ?description . }");
			queryStr.append("  OPTIONAL { ?subject coins2:creationDate ?creationDate . }");
			queryStr.append("  } ");
			queryStr.append("}");

			getEmbeddedServer().update(queryStr);
			
			queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("subject", getUri().toString());
			queryStr.append("  DELETE { GRAPH ?graph { ");
			queryStr.append("    ?subject coins2:hasProperties ?hasProperties . ");
			queryStr.append("    ?hasProperties ?predicate ?value . ");
			queryStr.append("  }} ");
			queryStr.append("WHERE { GRAPH ?graph { ");
			queryStr.append("  OPTIONAL { ?subject coins2:hasProperties ?hasProperties . ");
			queryStr.append("    ?hasProperties ?predicate ?value . } ");
			queryStr.append("  } ");
			queryStr.append("}");

			getEmbeddedServer().update(queryStr);

			queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
			queryStr.setIri("graph", getDatasetUri());
			queryStr.setIri("subject", getUri().toString());
			List<CoinsProperty> hasProperties = coinsObject.getHasProperties();
			if (hasProperties != null) {
				queryStr.append("  INSERT { GRAPH ?graph { ");
				int index = 0;
				for (CoinsProperty coinsProperty : hasProperties) {
					String name = "name" + index;
					queryStr.setLiteral(name, coinsProperty.getName());
					String value = "value" + index;

					switch (coinsProperty.getType().getFragment()) {
					case "BooleanProperty":
						queryStr.setLiteral(value, Boolean.parseBoolean(coinsProperty.getValue().toString()));
						queryStr.append(" ?subject coins2:hasProperties [rdf:type coins2:BooleanProperty; coins2:name ?"
								+ name + " ; coins2:datatypeValue ?" + value + " ] . ");
						break;
					case "DateTimeProperty":
						Calendar dateTime = DatatypeConverter.parseDateTime(coinsProperty.getValue().toString());
						queryStr.setLiteral(value, dateTime);
						queryStr.append(
								" ?subject coins2:hasProperties [rdf:type coins2:DateTimeProperty; coins2:name ?" + name
										+ " ; coins2:datatypeValue ?" + value + " ] . ");
						break;
					case "FloatProperty":
						queryStr.setLiteral(value, Float.parseFloat(coinsProperty.getValue().toString()));
						queryStr.append(" ?subject coins2:hasProperties [rdf:type coins2:FloatProperty; coins2:name ?"
								+ name + " ; coins2:datatypeValue ?" + value + " ] . ");
						break;
					case "IntegerProperty":
						queryStr.setLiteral(value, Integer.parseInt(coinsProperty.getValue().toString()));
						queryStr.append(" ?subject coins2:hasProperties [rdf:type coins2:IntegerProperty; coins2:name ?"
								+ name + " ; coins2:datatypeValue ?" + value + " ] . ");
						break;
					case "StringProperty":
						queryStr.setLiteral(value, coinsProperty.getValue().toString());
						queryStr.append(" ?subject coins2:hasProperties [rdf:type coins2:StringProperty; coins2:name ?"
								+ name + " ; coins2:datatypeValue ?" + value + " ] . ");
						break;
					case "DocumentProperty":
						Object propValue = coinsProperty.getValue();
						if (propValue != null) {
							queryStr.setIri(value, propValue.toString());
							queryStr.append(
									" ?subject coins2:hasProperties [rdf:type coins2:DocumentProperty; coins2:name ?"
											+ name + " ; coins2:objectValue ?" + value + " ] . ");

						} else {
							queryStr.append(
									" ?subject coins2:hasProperties [rdf:type coins2:DocumentProperty; coins2:name ?"
											+ name + " ] . ");
						}
						break;
					}
					index++;
				}
				queryStr.append("  }} ");
				queryStr.append("WHERE { ");
				queryStr.append("}");

				getEmbeddedServer().update(queryStr);
			}
		}
	}
}
