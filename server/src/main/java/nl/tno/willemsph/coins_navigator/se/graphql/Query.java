package nl.tno.willemsph.coins_navigator.se.graphql;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;

import nl.tno.willemsph.coins_navigator.se.graphql.models.Dataset;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Hamburger;
import nl.tno.willemsph.coins_navigator.se.graphql.models.NumericProperty;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Performance;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PortRealisation;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModule;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationPort;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterface;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.DatasetRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.HamburgerRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.NumericPropertyRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PerformanceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PortRealisationRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationModuleRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationPortRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;

@Component
public class Query implements GraphQLQueryResolver {

	private final DatasetRepository datasetRepository;
	private final FunctionRepository functionRepository;
	private final HamburgerRepository hamburgerRepository;
	private final NumericPropertyRepository numericPropertyRepository;
	private final PerformanceRepository performanceRepository;
	private final PortRealisationRepository portRealisationRepository;
	private final RealisationModuleRepository realisationModuleRepository;
	private final RealisationPortRepository realisationPortRepository;
	private final RequirementRepository requirementRepository;
	private final SystemInterfaceRepository systemInterfaceRepository;
	private final SystemSlotRepository systemSlotRepository;

	public Query(DatasetRepository datasetRepository, FunctionRepository functionRepository,
			HamburgerRepository hamburgerRepository, NumericPropertyRepository numericPropertyRepository,
			PerformanceRepository performanceRepository, PortRealisationRepository portRealisationRepository,
			RealisationModuleRepository realisationModuleRepository,
			RealisationPortRepository realisationPortRepository, RequirementRepository requirementRepository,
			SystemInterfaceRepository systemInterfaceRepository, SystemSlotRepository systemSlotRepository) {
		this.datasetRepository = datasetRepository;
		this.functionRepository = functionRepository;
		this.hamburgerRepository = hamburgerRepository;
		this.numericPropertyRepository = numericPropertyRepository;
		this.performanceRepository = performanceRepository;
		this.portRealisationRepository = portRealisationRepository;
		this.realisationModuleRepository = realisationModuleRepository;
		this.realisationPortRepository = realisationPortRepository;
		this.requirementRepository = requirementRepository;
		this.systemInterfaceRepository = systemInterfaceRepository;
		this.systemSlotRepository = systemSlotRepository;
	}

	public List<Dataset> allDatasets() throws URISyntaxException, IOException {
		return datasetRepository.getAllDatasets();
	}

	public List<Function> allFunctions(int datasetId) throws IOException, URISyntaxException {
		return functionRepository.getAllFunctions(datasetId);
	}

	public List<Hamburger> allHamburgers(int datasetId) throws IOException, URISyntaxException {
		return hamburgerRepository.getAllHamburgers(datasetId);
	}

	public List<NumericProperty> allNumericProperties(int datasetId) throws IOException, URISyntaxException {
		return numericPropertyRepository.getAllNumericProperties(datasetId);
	}

	public List<Performance> allPerformances(int datasetId) throws IOException, URISyntaxException {
		return performanceRepository.getAllPerformances(datasetId);
	}

	public List<RealisationModule> allRealisationModules(int datasetId) throws IOException, URISyntaxException {
		return realisationModuleRepository.getAllRealisationModules(datasetId);
	}

	public List<Requirement> allRequirements(int datasetId) throws IOException, URISyntaxException {
		return requirementRepository.getAllRequirements(datasetId);
	}

	public List<SystemInterface> allSystemInterfaces(int datasetId) throws IOException, URISyntaxException {
		return systemInterfaceRepository.getAllSystemInterfaces(datasetId);
	}

	public List<SystemSlot> allSystemSlots(int datasetId) throws IOException, URISyntaxException {
		return systemSlotRepository.getAllSystemSlots(datasetId);
	}

	public Hamburger oneHamburger(int datasetId, String uri) throws URISyntaxException, IOException {
		return hamburgerRepository.findOne(datasetId, uri);
	}

	public RealisationModule oneRealisationModule(int datasetId, String uri) throws URISyntaxException, IOException {
		return realisationModuleRepository.findOne(datasetId, uri);
	}
	
	public RealisationPort oneRealisationPort(int datasetId, String uri) throws URISyntaxException, IOException {
		return realisationPortRepository.findOne(datasetId, uri);
	}

	public PortRealisation onePortRealisation(int datasetId, String uri) throws URISyntaxException, IOException {
		return portRealisationRepository.findOne(datasetId, uri);
	}

	public SystemSlot oneSystemSlot(int datasetId, String uri) throws URISyntaxException, IOException {
		return systemSlotRepository.findOne(datasetId, uri);
	}

}
