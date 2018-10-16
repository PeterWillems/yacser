package nl.tno.willemsph.coins_navigator.se;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.jena.query.ParameterizedSparqlString;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import nl.tno.willemsph.coins_navigator.se.model.GetFunction;
import nl.tno.willemsph.coins_navigator.se.model.GetHamburger;
import nl.tno.willemsph.coins_navigator.se.model.GetNumericProperty;
import nl.tno.willemsph.coins_navigator.se.model.GetPerformance;
import nl.tno.willemsph.coins_navigator.se.model.GetPortRealisation;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationModule;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationPort;
import nl.tno.willemsph.coins_navigator.se.model.GetRequirement;
import nl.tno.willemsph.coins_navigator.se.model.GetSeObject;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemInterface;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemSlot;
import nl.tno.willemsph.coins_navigator.se.model.PutFunction;
import nl.tno.willemsph.coins_navigator.se.model.PutHamburger;
import nl.tno.willemsph.coins_navigator.se.model.PutNumericProperty;
import nl.tno.willemsph.coins_navigator.se.model.PutPerformance;
import nl.tno.willemsph.coins_navigator.se.model.PutPortRealisation;
import nl.tno.willemsph.coins_navigator.se.model.PutRealisationModule;
import nl.tno.willemsph.coins_navigator.se.model.PutRealisationPort;
import nl.tno.willemsph.coins_navigator.se.model.PutRequirement;
import nl.tno.willemsph.coins_navigator.se.model.PutSystemInterface;
import nl.tno.willemsph.coins_navigator.se.model.PutSystemSlot;
import nl.tno.willemsph.sparql.EmbeddedServer;

@Service
public class SeService {
	public enum SeObjectType {
		SystemSlot, RealisationModule, Function, Performance, Requirement, SystemInterface, Hamburger, PortRealisation, RealisationPort, NumericProperty, LifecyclePhase;

		GetSeObject create(SeService seService, int datasetId, String uri) throws URISyntaxException {
			switch (this) {
			case Function:
				return new GetFunction(seService, datasetId, uri);
			case Hamburger:
				return new GetHamburger(seService, datasetId, uri);
			case NumericProperty:
				return new GetNumericProperty(seService, datasetId, uri);
			case Performance:
				return new GetPerformance(seService, datasetId, uri);
			case PortRealisation:
				return new GetPortRealisation(seService, datasetId, uri);
			case RealisationModule:
				return new GetRealisationModule(seService, datasetId, uri);
			case RealisationPort:
				return new GetRealisationPort(seService, datasetId, uri);
			case Requirement:
				return new GetRequirement(seService, datasetId, uri);
			case SystemInterface:
				return new GetSystemInterface(seService, datasetId, uri);
			case SystemSlot:
				return new GetSystemSlot(seService, datasetId, uri);
			default:
				return null;
			}
		}

		public String getUri() {
			switch (this) {
			case NumericProperty:
				return EmbeddedServer.COINS2 + this.name();
			default:
				return EmbeddedServer.SE + this.name();
			}
		}
	}

	// @Autowired
	private static EmbeddedServer _embeddedServer;

	public static EmbeddedServer getEmbeddedServer() throws IOException, URISyntaxException {
		if (_embeddedServer == null) {
			_embeddedServer = new EmbeddedServer();
		}
		return _embeddedServer;
	}

	public List<GetSystemSlot> getAllSystemSlots(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.SystemSlot);

		List<GetSystemSlot> systemSlots = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			systemSlots.add((GetSystemSlot) seObject);
		}
		return systemSlots;
	}

	public GetFunction getFunction(int datasetId, String localName) throws URISyntaxException, IOException {
		return (GetFunction) getSeObject(datasetId, localName, SeObjectType.Function);
	}

	public GetHamburger getHamburger(int datasetId, String hamburgerLocalName) throws URISyntaxException, IOException {
		return (GetHamburger) getSeObject(datasetId, hamburgerLocalName, SeObjectType.Hamburger);
	}

	public GetSystemSlot getSystemSlot(int datasetId, String localName) throws URISyntaxException, IOException {
		return (GetSystemSlot) getSeObject(datasetId, localName, SeObjectType.SystemSlot);
	}

	public GetSystemInterface getSystemInterface(int datasetId, String localName)
			throws URISyntaxException, IOException {
		return (GetSystemInterface) getSeObject(datasetId, localName, SeObjectType.SystemInterface);
	}

	public List<Dataset> getAllDatasets() throws URISyntaxException, IOException {
		return getEmbeddedServer().getDatasets();
	}

	public Dataset getDataset(int datasetId) throws URISyntaxException, IOException {
		// return getEmbeddedServer().getDatasets().get(datasetId);
		return getEmbeddedServer().getDataset(datasetId);
	}

	public File getDatasetFile(int datasetId, String filePath)
			throws URISyntaxException, FileNotFoundException, IOException {
		return getEmbeddedServer().getDatasets().get(datasetId).getModel(filePath);
	}

	public Dataset saveDataset(int datasetId) throws URISyntaxException, FileNotFoundException, IOException {
		Dataset dataset = getEmbeddedServer().getDatasets().get(datasetId);
		dataset.save();
		return dataset;
	}

	public GetFunction createFunction(int datasetId) throws URISyntaxException, IOException {
		return GetFunction.create(this, datasetId, generateUri(datasetId, SeObjectType.Function));
	}

	public GetHamburger createHamburger(int datasetId) throws URISyntaxException, IOException {
		return GetHamburger.create(this, datasetId, generateUri(datasetId, SeObjectType.Hamburger));
	}

	public GetFunction updateFunction(int datasetId, String functionLocalName, PutFunction putFunction)
			throws URISyntaxException, IOException {
		GetFunction getFunction = getFunction(datasetId, functionLocalName);
		getFunction.update(putFunction);
		return getFunction;
	}

	public void deleteFunction(int datasetId, String functionLocalName) throws URISyntaxException, IOException {
		GetFunction getFunction = getFunction(datasetId, functionLocalName);
		getFunction.delete();
	}

	public GetNumericProperty updateNumericProperty(int datasetId, String numericPropertyLocalName,
			PutNumericProperty putNumericProperty) throws URISyntaxException, IOException {
		GetNumericProperty getNumericProperty = getNumericProperty(datasetId, numericPropertyLocalName);
		getNumericProperty.update(putNumericProperty);
		return getNumericProperty;
	}

	public void deleteNumericProperty(int datasetId, String numericPropertyLocalName)
			throws URISyntaxException, IOException {
		GetNumericProperty getNumericProperty = getNumericProperty(datasetId, numericPropertyLocalName);
		getNumericProperty.delete();
	}

	public GetRequirement updateRequirement(int datasetId, String requirementLocalName, PutRequirement putRequirement)
			throws URISyntaxException, IOException {
		GetRequirement getRequirement = getRequirement(datasetId, requirementLocalName);
		getRequirement.update(putRequirement);
		return getRequirement;
	}

	public void deleteRequirement(int datasetId, String requirementLocalName) throws URISyntaxException, IOException {
		GetRequirement getRequirement = getRequirement(datasetId, requirementLocalName);
		getRequirement.delete();
	}

	public GetPerformance updatePerformance(int datasetId, String performanceLocalName, PutPerformance putPerformance)
			throws URISyntaxException, IOException {
		GetPerformance getPerformance = getPerformance(datasetId, performanceLocalName);
		getPerformance.update(putPerformance);
		return getPerformance;
	}

	public void deletePerformance(int datasetId, String performanceLocalName) throws URISyntaxException, IOException {
		GetPerformance getPerformance = getPerformance(datasetId, performanceLocalName);
		getPerformance.delete();
	}

	public GetHamburger updateHamburger(int datasetId, String hamburgerLocalName, PutHamburger putHamburger)
			throws URISyntaxException, IOException {
		GetHamburger getHamburger = getHamburger(datasetId, hamburgerLocalName);
		getHamburger.update(putHamburger);
		return getHamburger;
	}

	public void deleteHamburger(int datasetId, String hamburgerLocalName) throws URISyntaxException, IOException {
		GetHamburger getHamburger = getHamburger(datasetId, hamburgerLocalName);
		getHamburger.delete();
	}

	public GetRealisationModule createRealisationModule(int datasetId) throws URISyntaxException, IOException {
		return GetRealisationModule.create(this, datasetId, generateUri(datasetId, SeObjectType.RealisationModule));
	}

	public GetRealisationModule updateRealisationModule(int datasetId, String realisationModuleLocalName,
			PutRealisationModule putRealisationModule) throws URISyntaxException, IOException {
		GetRealisationModule realisationModule = getRealisationModule(datasetId, realisationModuleLocalName);
		realisationModule.update(putRealisationModule);
		return realisationModule;
	}

	public void deleteRealisationModule(int datasetId, String realisationModuleLocalName)
			throws URISyntaxException, IOException {
		GetRealisationModule realisationModule = getRealisationModule(datasetId, realisationModuleLocalName);
		realisationModule.delete();
	}

	public GetRealisationModule getRealisationModule(int datasetId, String realisationModuleUri)
			throws URISyntaxException, IOException {
		return (GetRealisationModule) getSeObject(datasetId, realisationModuleUri, SeObjectType.RealisationModule);
	}

	public GetRealisationPort createRealisationPort(int datasetId) throws URISyntaxException, IOException {
		return GetRealisationPort.create(this, datasetId, generateUri(datasetId, SeObjectType.RealisationPort));
	}

	public GetRealisationPort getRealisationPort(int datasetId, String localName)
			throws URISyntaxException, IOException {
		return (GetRealisationPort) getSeObject(datasetId, localName, SeObjectType.RealisationPort);
	}

	public GetRealisationPort updateRealisationPort(int datasetId, String realisationPortLocalName,
			PutRealisationPort putRealisationPort) throws URISyntaxException, IOException {
		GetRealisationPort getRealisationPort = getRealisationPort(datasetId, realisationPortLocalName);
		getRealisationPort.update(putRealisationPort);
		return getRealisationPort;
	}

	public void deleteRealisationPort(int datasetId, String realisationPortLocalName)
			throws URISyntaxException, IOException {
		GetRealisationPort getRealisationPort = getRealisationPort(datasetId, realisationPortLocalName);
		getRealisationPort.delete();
	}

	public GetRequirement createRequirement(int datasetId) throws URISyntaxException, IOException {
		return GetRequirement.create(this, datasetId, generateUri(datasetId, SeObjectType.Requirement));
	}

	public GetPerformance getPerformance(int datasetId, String functionUri) throws URISyntaxException, IOException {
		return (GetPerformance) getSeObject(datasetId, functionUri, SeObjectType.Performance);
	}

	public GetRequirement getRequirement(int datasetId, String functionUri) throws URISyntaxException, IOException {
		return (GetRequirement) getSeObject(datasetId, functionUri, SeObjectType.Requirement);
	}

	public GetSystemSlot createSystemSlot(int datasetId) throws URISyntaxException, IOException {
		return GetSystemSlot.create(this, datasetId, generateUri(datasetId, SeObjectType.SystemSlot));
	}

	public GetSystemSlot updateSystemSlot(int datasetId, String systemSlotLocalName, PutSystemSlot putSystemSlot)
			throws URISyntaxException, IOException {
		GetSystemSlot getSystemSlot = getSystemSlot(datasetId, systemSlotLocalName);
		getSystemSlot.update(putSystemSlot);
		return getSystemSlot;
	}

	public void deleteSystemSlot(int datasetId, String systemSlotLocalName) throws URISyntaxException, IOException {
		GetSystemSlot getSystemSlot = getSystemSlot(datasetId, systemSlotLocalName);
		getSystemSlot.delete();
	}

	public GetSystemInterface updateSystemInterface(int datasetId, String systemInterfaceLocalName,
			PutSystemInterface putSystemInterface) throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = getSystemInterface(datasetId, systemInterfaceLocalName);
		getSystemInterface.update(putSystemInterface);
		return getSystemInterface;
	}

	public void deleteSystemInterface(int datasetId, String systemInterfaceLocalName)
			throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = getSystemInterface(datasetId, systemInterfaceLocalName);
		getSystemInterface.delete();
	}

	public List<GetFunction> getAllFunctions(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.Function);

		List<GetFunction> functions = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			functions.add((GetFunction) seObject);
		}
		return functions;
	}

	public List<GetHamburger> getAllHamburgers(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.Hamburger);

		List<GetHamburger> hamburgers = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			hamburgers.add((GetHamburger) seObject);
		}
		return hamburgers;
	}

	public GetNumericProperty createNumericProperty(int datasetId) throws URISyntaxException, IOException {
		return GetNumericProperty.create(this, datasetId, generateUri(datasetId, SeObjectType.NumericProperty),
				EmbeddedServer.COINS2 + "FloatProperty");
	}

	public List<GetPortRealisation> getAllPortRealisations(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.PortRealisation);

		List<GetPortRealisation> portRealisations = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			portRealisations.add((GetPortRealisation) seObject);
		}
		return portRealisations;
	}

	public GetPortRealisation createPortRealisation(int datasetId) throws URISyntaxException, IOException {
		return GetPortRealisation.create(this, datasetId, generateUri(datasetId, SeObjectType.PortRealisation));
	}

	public GetPortRealisation getPortRealisation(int datasetId, String portRealisationLocalName)
			throws URISyntaxException, IOException {
		return (GetPortRealisation) getSeObject(datasetId, portRealisationLocalName, SeObjectType.PortRealisation);
	}

	public GetPortRealisation updatePortRealisation(int datasetId, String portRealisationLocalName,
			PutPortRealisation putPortRealisation) throws URISyntaxException, IOException {
		GetPortRealisation getPortRealisation = getPortRealisation(datasetId, portRealisationLocalName);
		getPortRealisation.update(putPortRealisation);
		return getPortRealisation;
	}

	public void deletePortRealisation(int datasetId, String portRealisationLocalName)
			throws URISyntaxException, IOException {
		GetPortRealisation getPortRealisation = getPortRealisation(datasetId, portRealisationLocalName);
		getPortRealisation.delete();
	}

	private List<URI> getPortRealisations(String datasetUri, String hamburgerUri)
			throws IOException, URISyntaxException {
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.setIri("hamburger", hamburgerUri);
		queryStr.append("SELECT ?port_realisation ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("      ?hamburger se:hasPortRealisation ?port_realisation . ");
		queryStr.append("  }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		List<URI> portRealisationUris = new ArrayList<>();
		for (JsonNode node : responseNodes) {
			JsonNode portRealisationNode = node.get("port_realisation");
			String portRealisation = portRealisationNode != null ? portRealisationNode.get("value").asText() : null;
			URI portRealisationUri = portRealisation != null ? new URI(portRealisation) : null;
			if (portRealisationUri != null)
				portRealisationUris.add(portRealisationUri);
		}
		return portRealisationUris;
	}

	private List<URI> getRealisationPorts(int datasetId, String ownerUri) throws URISyntaxException, IOException {
		String datasetUri = getDatasetUri(datasetId);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.setIri("owner", ownerUri);
		queryStr.append("SELECT ?port ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("      ?owner se:hasPort ?port . ");
		queryStr.append("  }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		List<URI> realisationPortUris = new ArrayList<>();
		for (JsonNode node : responseNodes) {
			JsonNode realisationPortNode = node.get("port");
			String realisationPortUri = realisationPortNode != null ? realisationPortNode.get("value").asText() : null;
			if (realisationPortUri != null) {
				realisationPortUris.add(new URI(realisationPortUri));
			}
		}
		return realisationPortUris;
	}

	public List<GetPerformance> getAllPerformances(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.Performance);

		List<GetPerformance> performances = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			performances.add((GetPerformance) seObject);
		}
		return performances;
	}

	public GetPerformance createPerformance(int datasetId) throws URISyntaxException, IOException {
		return GetPerformance.create(this, datasetId, generateUri(datasetId, SeObjectType.Performance));
	}

	public List<GetRequirement> getAllRequirements(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.Requirement);

		List<GetRequirement> requirements = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			requirements.add((GetRequirement) seObject);
		}
		return requirements;
	}

	public List<GetNumericProperty> getAllNumericProperties(int datasetId) throws IOException, URISyntaxException {

		String datasetUri = getDatasetUri(datasetId);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.append("SELECT ?se_object ");
		queryStr.append("{");
		// queryStr.append(" GRAPH ?graph { ");
		// queryStr.append(" OPTIONAL {");
		// queryStr.append(" ?se_object rdf:type ?type . ");
		// queryStr.append(" ?type rdfs:subClassOf coins2:NumericProperty . ");
		// queryStr.append(" }");
		// queryStr.append(" OPTIONAL {");
		// queryStr.append(" ?se_object rdf:type ?type . ");
		// queryStr.append(" ?type rdfs:subClassOf coins2:FloatProperty . ");
		// queryStr.append(" }");
		// queryStr.append(" OPTIONAL {");
		// queryStr.append(" ?se_object rdf:type ?type . ");
		// queryStr.append(" ?type rdfs:subClassOf coins2:IntegerProperty . ");
		// queryStr.append(" }");
		// queryStr.append(" }");
		queryStr.append(" GRAPH ?graph { ");
		queryStr.append("   OPTIONAL {");
		queryStr.append("     ?se_object rdf:type ?type . ");
		queryStr.append("     ?type rdfs:subClassOf coins2:FloatProperty . ");
		queryStr.append("   } ");
		queryStr.append("   OPTIONAL {");
		queryStr.append("     ?se_object rdf:type ?type . ");
		queryStr.append("     ?type rdfs:subClassOf coins2:IntegerProperty . ");
		queryStr.append("   } ");
		queryStr.append("  }");
		queryStr.append("   OPTIONAL {");
		queryStr.append("     GRAPH ?graph { ");
		queryStr.append("       ?se_object rdf:type ?type . ");
		queryStr.append("     }");
		queryStr.append("     ?type rdfs:subClassOf+ coins2:NumericProperty . ");
		queryStr.append("   }");
		queryStr.append("}");

		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		List<GetNumericProperty> numericProperties = new ArrayList<>();
		if (responseNodes.size() > 0) {
			for (JsonNode node : responseNodes) {
				JsonNode jsonNode = node.get("se_object");
				if (jsonNode != null) {
					String seObjectUri = jsonNode.get("value").asText();
					// JsonNode labelNode = node.get("label");
					// String label = labelNode != null ? labelNode.get("value").asText() : null;
					// JsonNode typeNode = node.get("type");
					// String typeUri = typeNode != null ? typeNode.get("value").asText() : null;
					// JsonNode datatypeValueNode = node.get("datatype_value");
					// Double datatypeValue = datatypeValueNode != null ?
					// datatypeValueNode.get("value").asDouble() : null;
					// JsonNode unitNode = node.get("unit");
					// String unitUri = unitNode != null ? unitNode.get("value").asText() : null;
					// NumericProperty numericProperty = new NumericProperty(seObjectUri, label,
					// typeUri, datatypeValue, unitUri);
					GetNumericProperty numericProperty = new GetNumericProperty(this, datasetId, seObjectUri);
					// numericProperty.setSeService(this);
					// numericProperty.setDatasetId(datasetId);
					numericProperties.add(numericProperty);
				}
			}
		}
		return numericProperties;
	}

	public GetNumericProperty getNumericProperty(int datasetId, String numericPropertylocalName)
			throws URISyntaxException, IOException {
		return (GetNumericProperty) getSeObject(datasetId, numericPropertylocalName, SeObjectType.NumericProperty);
	}

	public List<GetSystemInterface> getAllSystemInterfaces(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.SystemInterface);

		List<GetSystemInterface> systemInterfaces = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			systemInterfaces.add((GetSystemInterface) seObject);
		}
		return systemInterfaces;
	}

	public GetSystemInterface createSystemInterface(int datasetId) throws URISyntaxException, IOException {
		return GetSystemInterface.create(this, datasetId, generateUri(datasetId, SeObjectType.SystemInterface));
	}

	public List<GetRealisationModule> getAllRealisationModules(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.RealisationModule);

		List<GetRealisationModule> realisationModules = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			realisationModules.add((GetRealisationModule) seObject);
		}
		return realisationModules;
	}

	public List<GetRealisationPort> getAllRealisationPorts(int datasetId) throws IOException, URISyntaxException {
		List<GetSeObject> seObjects = getAllSeObjects(datasetId, SeObjectType.RealisationPort);

		List<GetRealisationPort> realisationPorts = new ArrayList<>();
		for (GetSeObject seObject : seObjects) {
			realisationPorts.add((GetRealisationPort) seObject);
		}
		return realisationPorts;
	}

	public List<GetHamburger> getHamburgersForSystemSlot(int datasetId, String systemSlotLocalName)
			throws URISyntaxException, IOException {
		String datasetUri = getDatasetUri(datasetId);
		String ontologyUri = getOntologyUri(datasetId);
		String systemSlotUri = ontologyUri + "#" + systemSlotLocalName;
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.setIri("system_slot", systemSlotUri);
		queryStr.append("SELECT ?hamburger ?technical_solution ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    ?hamburger se:functionalUnit ?system_slot . ");
		queryStr.append("    OPTIONAL { ");
		queryStr.append("      ?hamburger se:technicalSolution ?technical_solution . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");

		Map<String, String> hamburgerMap = new HashMap<>();
		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		for (JsonNode node : responseNodes) {
			String hamburgerUri = node.get("hamburger").get("value").asText();
			JsonNode technical_solutionNode = node.get("technical_solution");
			String technical_solutionUri = technical_solutionNode != null ? technical_solutionNode.get("value").asText()
					: null;
			hamburgerMap.put(hamburgerUri, technical_solutionUri);
		}

		List<GetHamburger> hamburgers = new ArrayList<>();
		for (String hamburgerUri : hamburgerMap.keySet()) {
			String hamburgerLocalName = getLocalName(hamburgerUri);
			GetHamburger hamburger = (GetHamburger) getSeObject(datasetId, hamburgerLocalName, SeObjectType.Hamburger);
			hamburgers.add(hamburger);
		}

		return hamburgers;
	}

	public List<GetHamburger> getHamburgersForRealisationModule(int datasetId, String realisationModuleLocalName)
			throws URISyntaxException, IOException {
		String datasetUri = getDatasetUri(datasetId);
		String ontologyUri = getOntologyUri(datasetId);
		String realisationModuleUri = ontologyUri + "#" + realisationModuleLocalName;
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.setIri("realisation_module", realisationModuleUri);
		queryStr.append("SELECT ?hamburger ?functional_unit ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    ?hamburger se:technicalSolution ?realisation_module . ");
		queryStr.append("    OPTIONAL { ");
		queryStr.append("      ?hamburger se:functionalUnit ?functional_unit . ");
		queryStr.append("    }");
		queryStr.append("  }");
		queryStr.append("}");

		Map<String, String> hamburgerMap = new HashMap<>();
		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		for (JsonNode node : responseNodes) {
			String hamburgerUri = node.get("hamburger").get("value").asText();
			JsonNode functionalUnitNode = node.get("functional_unit");
			String functionalUnitUri = functionalUnitNode != null ? functionalUnitNode.get("value").asText() : null;
			hamburgerMap.put(hamburgerUri, functionalUnitUri);
		}

		List<GetHamburger> hamburgers = new ArrayList<>();
		for (String hamburgerUri : hamburgerMap.keySet()) {
			String hamburgerLocalName = getLocalName(hamburgerUri);
			GetHamburger hamburger = (GetHamburger) getSeObject(datasetId, hamburgerLocalName, SeObjectType.Hamburger);
			hamburgers.add(hamburger);
		}

		return hamburgers;
	}

	public List<GetRealisationPort> getPortsForRealisationModule(int datasetId, String realisationModuleLocalName)
			throws URISyntaxException, IOException {
		String ontologyUri = getOntologyUri(datasetId);
		String realisationModuleUri = ontologyUri + "#" + realisationModuleLocalName;
		List<URI> portUris = getRealisationPorts(datasetId, realisationModuleUri);
		List<GetRealisationPort> ports = new ArrayList<>();
		for (URI portUri : portUris) {
			String localName = getLocalName(portUri.toString());
			GetRealisationPort port = (GetRealisationPort) getSeObject(datasetId, localName,
					SeObjectType.RealisationPort);
			ports.add(port);
		}
		return ports;
	}

	private List<GetSeObject> getAllSeObjects(int datasetId, SeObjectType seObjectType)
			throws IOException, URISyntaxException {
		String datasetUri = getDatasetUri(datasetId);
		ParameterizedSparqlString queryStr = new ParameterizedSparqlString(getEmbeddedServer().getPrefixMapping());
		queryStr.setIri("graph", datasetUri);
		queryStr.setIri("SeObject", seObjectType.getUri());
		queryStr.append("SELECT ?se_object ");
		queryStr.append("{");
		queryStr.append("  GRAPH ?graph { ");
		queryStr.append("    ?se_object rdf:type ?SeObject . ");
		queryStr.append("  }");
		queryStr.append("}");

		List<GetSeObject> seObjects = new ArrayList<>();
		JsonNode responseNodes = getEmbeddedServer().query(queryStr);
		for (JsonNode node : responseNodes) {
			String seObjectUri = node.get("se_object").get("value").asText();
			GetSeObject seObject = seObjectType.create(this, datasetId, seObjectUri);
			seObjects.add(seObject);
		}

		return seObjects;
	}

	public GetSeObject getSeObject(int datasetId, String localName, SeObjectType seObjectType)
			throws URISyntaxException, IOException {
		String ontologyUri = getOntologyUri(datasetId);
		String seObjectUri = ontologyUri + "#" + localName;
		return seObjectType.create(this, datasetId, seObjectUri);
	}

	private String getDatasetUri(int datasetId) throws URISyntaxException, IOException {
		return getEmbeddedServer().getDatasets().get(datasetId).getUri().toString();

	}

	private String generateUri(int datasetId, SeObjectType seObjectType) throws URISyntaxException, IOException {
		String localName = seObjectType.name() + "_" + UUID.randomUUID().toString();
		return getOntologyUri(datasetId) + "#" + localName;
	}

	public String getOntologyUri(int datasetId) throws URISyntaxException, IOException {
		return getEmbeddedServer().getDatasets().get(datasetId).getOntologyUri().toString();
	}

	public String getLocalName(String uri) {
		int indexOfHashMark = uri.indexOf('#');
		return uri.substring(indexOfHashMark + 1);
	}

	public List<GetPortRealisation> getPortRealisationsOfHamburger(int datasetId, String hamburgerLocalName)
			throws IOException, URISyntaxException {
		String datasetUri = getDatasetUri(datasetId);
		String ontologyUri = getOntologyUri(datasetId);
		List<URI> portRealisationUris = getPortRealisations(datasetUri, ontologyUri + "#" + hamburgerLocalName);
		List<GetPortRealisation> portRealisations = new ArrayList<>();
		for (URI portRealisationUri : portRealisationUris) {
			GetPortRealisation portRealisation = (GetPortRealisation) getSeObject(datasetId,
					getLocalName(portRealisationUri.toString()), SeObjectType.PortRealisation);
			portRealisations.add(portRealisation);
		}
		return portRealisations;
	}

	public void updateDataset(int datasetId, String label, URI uri, String versionInfo) throws IOException, URISyntaxException {
		getEmbeddedServer().updateDataset(datasetId, label, uri, versionInfo);
	}

	public Dataset createDataset(Dataset dataset) throws IOException, URISyntaxException {
		return getEmbeddedServer().createDataset(dataset);
	}

}
