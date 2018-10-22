package nl.tno.willemsph.sparql;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.jena.fuseki.embedded.FusekiServer;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ParameterizedSparqlString;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.RDFWriter;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.shared.PrefixMapping;
import org.apache.jena.vocabulary.OWL;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.apache.jena.vocabulary.XSD;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmbeddedServer {
	public static final String QUERY_URL = "http://localhost:3330/rdf/query";
	public static final String UPDATE_URL = "http://localhost:3330/rdf/update";
	public static final String SE_EXAMPLE_URI = "http://www.coinsweb.nl/coins2/reffrm/se/";
	public static final String COINS2 = "http://www.coinsweb.nl/cbim-2.0.rdf#";
	private static final String CBIM2_RESOURCE = "cbim-2.0.rdf";
	// public static final String SE = "http://www.coinsweb.nl/coins2/reffrm/se#";
	public static final String SE = "http://www.infrabim.nl/coins/se/yacser#";
	private static final String SE_RESOURCE = "se.ttl";
	private static final String[] EXAMPLES = { "new", "parkbank3", "wegjunctie", "wissel", "verbinding" };
	public static Dataset ds;
	private static FusekiServer fuseki;
	private PrefixMapping prefixMapping;

	public EmbeddedServer() throws IOException, URISyntaxException {
		exampleDatasets = new ArrayList<>();
		startServer();
	}

	public void startServer() throws IOException, URISyntaxException {
		Resource cbim2 = new ClassPathResource(CBIM2_RESOURCE);
		Resource se = new ClassPathResource(SE_RESOURCE);

		Model defaultModel = ModelFactory.createDefaultModel();
		defaultModel.read(cbim2.getInputStream(), null);
		defaultModel.read(se.getInputStream(), null, "TURTLE");
		ds = DatasetFactory.create(defaultModel);

		File examplesDirectory = new ClassPathResource("examples").getFile();
		File[] examples = examplesDirectory.listFiles();
		int id = 0;
		for (File example : examples) {
			String label = example.getName().substring(0, example.getName().lastIndexOf('.'));
			exampleDatasets.add(
					new nl.tno.willemsph.coins_navigator.se.Dataset(id++, label, "examples/" + label + ".ttl", null));
		}

		// int id = 0;
		// for (String label : EXAMPLES) {
		// exampleDatasets.add(new nl.tno.willemsph.coins_navigator.se.Dataset(id++,
		// label,
		// "examples/" + label + ".ttl", SE_EXAMPLE_URI + label));
		// }

		for (nl.tno.willemsph.coins_navigator.se.Dataset dataset : exampleDatasets) {
			Model namedModel = ModelFactory.createDefaultModel();
			Resource model = new ClassPathResource(dataset.getFilepath());
			namedModel.read(model.getInputStream(), null, "TURTLE");
			StmtIterator ontologyIterator = namedModel.listStatements(null, RDF.type, OWL.Ontology);
			if (ontologyIterator.hasNext()) {
				Statement nextOntology = ontologyIterator.next();
				dataset.setOntologyUri(new URI(nextOntology.getSubject().getURI()));
				dataset.setUri(new URI(nextOntology.getSubject().getURI()));
				StmtIterator versionInfoIterator = namedModel.listStatements(nextOntology.getSubject(), OWL.versionInfo,
						(RDFNode) null);
				if (versionInfoIterator.hasNext()) {
					dataset.setVersionInfo(versionInfoIterator.next().getObject().asLiteral().getString());
				}
				List<URI> imports = new ArrayList<>();
				StmtIterator importsIterator = namedModel.listStatements(nextOntology.getSubject(), OWL.imports,
						(RDFNode) null);
				while (importsIterator.hasNext()) {
					imports.add(new URI(importsIterator.next().getObject().asResource().getURI()));
				}
				if (imports.size() > 0) {
					dataset.setImports(imports);
				}
			}
			ds.addNamedModel(dataset.getUri().toString(), namedModel);
		}

		fuseki = FusekiServer.create().add("/rdf", ds, true).build();
		fuseki.start();
	}

	public PrefixMapping getPrefixMapping() {
		if (prefixMapping == null) {
			prefixMapping = PrefixMapping.Factory.create();
			prefixMapping.setNsPrefix("rdf", RDF.uri);
			prefixMapping.setNsPrefix("rdfs", RDFS.uri);
			prefixMapping.setNsPrefix("owl", OWL.NS);
			prefixMapping.setNsPrefix("xml", "http://www.w3.org/XML/1998/namespace/");
			prefixMapping.setNsPrefix("coins2", COINS2);
			prefixMapping.setNsPrefix("se", SE);
		}
		return prefixMapping;
	}

	public JsonNode query(ParameterizedSparqlString queryStr) throws IOException {
		String query = queryStr.toString();
		HttpURLConnection con = getQueryConnection();
		JsonNode bindings = sendQuery(con, query);
		return bindings;
	}

	public void update(ParameterizedSparqlString queryStr) throws IOException {
		String query = queryStr.toString();
		HttpURLConnection con = getUpdateConnection();
		sendUpdate(con, query);
	}

	private HttpURLConnection getQueryConnection() throws IOException {
		URL obj = new URL(QUERY_URL);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// add request header
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/sparql-query");
		return con;
	}

	private HttpURLConnection getUpdateConnection() throws IOException {
		URL obj = new URL(UPDATE_URL);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();

		// add request header
		con.setRequestMethod("POST");
		con.setRequestProperty("Content-Type", "application/sparql-update");
		return con;
	}

	private JsonNode sendQuery(HttpURLConnection con, String query) throws IOException {
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(query);
		wr.flush();
		wr.close();
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'POST' request to URL : " + EmbeddedServer.class);
		System.out.println("Post parameters : " + query);
		System.out.println("Response Code : " + responseCode);
		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
		ObjectMapper mapper = new ObjectMapper();
		JsonNode jTree = mapper.readTree(in);
		JsonNode bindings = jTree.findValue("bindings");
		return bindings;
	}

	private void sendUpdate(HttpURLConnection con, String query) throws IOException {
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(query);
		wr.flush();
		wr.close();
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'POST' request to URL : " + EmbeddedServer.class);
		System.out.println("Post parameters : " + query);
		System.out.println("Response Code : " + responseCode);
	}

	public List<nl.tno.willemsph.coins_navigator.se.Dataset> exampleDatasets;

	public List<nl.tno.willemsph.coins_navigator.se.Dataset> getDatasets() throws URISyntaxException, IOException {
		// if (datasets == null) {
		// datasets = new ArrayList<>();
		// int id = 0;
		// for (String example : EXAMPLES) {
		// datasets.add(new nl.tno.willemsph.coins_navigator.se.Dataset(id++,
		// "examples/" + example + ".ttl",
		// SE_EXAMPLE_URI + example));
		// }
		// }
		List<nl.tno.willemsph.coins_navigator.se.Dataset> datasets = new ArrayList<>();
		int id = 0;
		Iterator<String> datasetNamesIterator = ds.listNames();
		while (datasetNamesIterator.hasNext()) {
			datasetNamesIterator.next();
			datasets.add(getDataset(id++));
		}
		// for (String example : EXAMPLES) {
		// datasets.add(getDataset(id++));
		// }
		return datasets;
	}

	public void saveDataset(int datasetId) throws URISyntaxException, IOException {
		DatasetAccessor datasetAccessor = DatasetAccessorFactory.create(ds);
		String graphUri = getDatasets().get(datasetId).getUri().toString();
		Model model = datasetAccessor.getModel(graphUri);
		RDFWriter writer = model.getWriter("TURTLE");
		writer.write(model, System.out, null);
	}

	public void updateDataset(int datasetId, String label, URI uri, String versionInfo)
			throws IOException, URISyntaxException {
//		nl.tno.willemsph.coins_navigator.se.Dataset getDataset = getDatasets().get(datasetId);
		nl.tno.willemsph.coins_navigator.se.Dataset getDataset = exampleDatasets.get(datasetId);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getPrefixMapping());
		queryStr.setIri("graph", getDataset.getUri().toString());
		queryStr.setIri("ontology", getDataset.getUri().toString());
		queryStr.setIri("ontologyType", OWL.Ontology.getURI());
		queryStr.setLiteral("new_versionInfo", versionInfo);
		queryStr.setLiteral("new_label", label);
		queryStr.append("  DELETE { GRAPH ?graph { ?ontology rdfs:label ?label ; owl:versionInfo ?versionInfo . }} ");
		queryStr.append(
				"  INSERT { GRAPH ?graph { ?ontology rdfs:label ?new_label ; owl:versionInfo ?new_versionInfo . }} ");
		queryStr.append(
				"WHERE { GRAPH ?graph {?ontology rdf:type ?ontologyType ; rdfs:label ?label ; owl:versionInfo ?versionInfo . } ");
		queryStr.append("}");

		update(queryStr);
	}

	public nl.tno.willemsph.coins_navigator.se.Dataset getDataset(int datasetId)
			throws IOException, URISyntaxException {
		nl.tno.willemsph.coins_navigator.se.Dataset getDataset = exampleDatasets.get(datasetId);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getPrefixMapping());
		queryStr.setIri("graph", getDataset.getUri().toString());
		queryStr.setIri("ontology", getDataset.getUri().toString());
		queryStr.append("SELECT ?label ?versionInfo ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    OPTIONAL {");
		queryStr.append("      ?ontology rdfs:label ?label . ");
		queryStr.append("      ?ontology owl:versionInfo ?versionInfo . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");
		queryStr.append("ORDER BY ?label");

		nl.tno.willemsph.coins_navigator.se.Dataset dataset = null;
		JsonNode responseNodes = query(queryStr);
		if (responseNodes.size() > 0) {
			JsonNode labelNode = responseNodes.get(0).get("label");
			String label = labelNode != null ? labelNode.get("value").asText() : null;
			JsonNode versionInfoNode = responseNodes.get(0).get("versionInfo");
			String versionInfo = versionInfoNode != null ? versionInfoNode.get("value").asText() : null;
			dataset = new nl.tno.willemsph.coins_navigator.se.Dataset(datasetId, getDataset.getLabel(),
					getDataset.getFilepath(), getDataset.getUri().toString());
			dataset.setLabel(label);
			dataset.setVersionInfo(versionInfo);
			dataset.setOntologyUri(getDataset.getUri());
			dataset.setImports(getDataset.getImports());
		}
		return dataset;
	}

	public nl.tno.willemsph.coins_navigator.se.Dataset createDataset(
			nl.tno.willemsph.coins_navigator.se.Dataset dataset) throws URISyntaxException, IOException {
		String label = dataset.getLabel();
		String uriString = dataset.getUri().toString();
		URI uri = !uriString.isEmpty() ? dataset.getUri()
				: new URI("http://www.infrabim.nl/coins/se/" + dataset.getLabel());
		dataset.setUri(uri);
		Model newModel = ModelFactory.createDefaultModel();
		newModel.setNsPrefix("", uri.toString() + "#");
		newModel.setNsPrefix("se", "http://www.infrabim.nl/coins/se/yacser#");
		newModel.setNsPrefix("rdf", RDF.getURI());
		newModel.setNsPrefix("rdfs", RDFS.getURI());
		newModel.setNsPrefix("owl", OWL.getURI());
		newModel.setNsPrefix("xsd", XSD.getURI());
		newModel.setNsPrefix("coins2", COINS2);

		org.apache.jena.rdf.model.Resource ontology = newModel.createResource(uri.toString());
		newModel.add(newModel.createStatement(ontology, RDF.type, OWL.Ontology));
		newModel.add(newModel.createStatement(ontology, RDFS.label, label));
		if (dataset.getImports() != null && !dataset.getImports().isEmpty()) {
			for (URI importModel : dataset.getImports()) {
				newModel.add(newModel.createStatement(ontology, OWL.imports,
						newModel.createResource(importModel.toString())));
			}
		} else {
			newModel.add(newModel.createStatement(ontology, OWL.imports,
					newModel.createResource("http://www.infrabim.nl/coins/se/yacser")));
			List<URI> imports = new ArrayList<>();
			imports.add(new URI("http://www.infrabim.nl/coins/se/yacser"));
			dataset.setImports(imports);
		}
		if (dataset.getVersionInfo() != null && !dataset.getVersionInfo().isEmpty()) {
			newModel.add(newModel.createStatement(ontology, OWL.versionInfo, dataset.getVersionInfo()));
		} else {
			String versionInfo = "Created with COINS Navigator SE";
			newModel.add(newModel.createStatement(ontology, OWL.versionInfo, versionInfo));
			dataset.setVersionInfo(versionInfo);
		}
		RDFWriter writer = newModel.getWriter("TURTLE");
		writer.write(newModel, System.out, uri.toString());

		Iterator<String> namesIterator = ds.listNames();
		int datasetCount = 0;
		while (namesIterator.hasNext()) {
			System.out.println(namesIterator.next());
			datasetCount++;
		}
		dataset.setId(datasetCount);
		ds.addNamedModel(dataset.getUri().toString(), newModel);
		exampleDatasets.add(dataset);

		createResource(dataset);
		return dataset;
	}

	private void createResource(nl.tno.willemsph.coins_navigator.se.Dataset dataset) throws IOException {
		ClassPathResource classPathResource = new ClassPathResource("examples");
		String fileName = dataset.getLabel() + ".ttl";
		dataset.setFilepath("examples/" + fileName);
		File directory = classPathResource.getFile();
		File file = new File(directory, fileName);
		file.createNewFile();
		dataset.save();
	}

}
