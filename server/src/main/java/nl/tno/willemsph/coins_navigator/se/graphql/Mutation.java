package nl.tno.willemsph.coins_navigator.se.graphql;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;

import nl.tno.willemsph.coins_navigator.se.graphql.models.CoinsObjectInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.FunctionInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Hamburger;
import nl.tno.willemsph.coins_navigator.se.graphql.models.HamburgerInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.NumericProperty;
import nl.tno.willemsph.coins_navigator.se.graphql.models.NumericPropertyInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Performance;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PerformanceInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PortRealisation;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PortRealisationInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModule;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModuleInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationPort;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationPortInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RequirementInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterface;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterfaceInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlotInput;
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
public class Mutation implements GraphQLMutationResolver {

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

	public Mutation(FunctionRepository functionRepository, HamburgerRepository hamburgerRepository,
			NumericPropertyRepository numericPropertyRepository, PerformanceRepository performanceRepository,
			PortRealisationRepository portRealisationRepository,
			RealisationModuleRepository realisationModuleRepository,
			RealisationPortRepository realisationPortRepository, RequirementRepository requirementRepository,
			SystemInterfaceRepository systemInterfaceRepository, SystemSlotRepository systemSlotRepository) {
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

	/*
	 * FUNCTIONS
	 */
	public Function createFunction(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		Function newFunction = new Function(datasetId, uri, label);
		functionRepository.saveFunction(newFunction);
		return newFunction;
	}

	public Function updateFunction(FunctionInput functionInput, CoinsObjectInput coinsObjectInput) throws URISyntaxException, IOException {
		return functionRepository.updateOne(functionInput, coinsObjectInput);
	}

	public Function deleteFunction(int datasetId, String uri) throws URISyntaxException, IOException {
		return functionRepository.deleteOne(datasetId, uri);
	}

	/*
	 * HAMBURGERS
	 */
	public Hamburger createHamburger(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		Hamburger newHamburger = new Hamburger(datasetId, uri, label);
		hamburgerRepository.saveHamburger(newHamburger);
		return newHamburger;
	}

	public Hamburger updateHamburger(HamburgerInput hamburgerInput) throws URISyntaxException, IOException {
		return hamburgerRepository.updateOne(hamburgerInput);
	}

	public Hamburger deleteHamburger(int datasetId, String uri) throws URISyntaxException, IOException {
		return hamburgerRepository.deleteOne(datasetId, uri);
	}

	/*
	 * NUMERIC PROPERTY
	 */
	public NumericProperty createNumericProperty(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		NumericProperty newNumericProperty = new NumericProperty(datasetId, uri, label);
		numericPropertyRepository.saveNumericProperty(newNumericProperty);
		return newNumericProperty;
	}

	public NumericProperty updateNumericProperty(NumericPropertyInput numericPropertyInput)
			throws URISyntaxException, IOException {
		return numericPropertyRepository.updateOne(numericPropertyInput);
	}

	public NumericProperty deleteNumericProperty(int datasetId, String uri) throws URISyntaxException, IOException {
		return numericPropertyRepository.deleteOne(datasetId, uri);
	}

	/*
	 * PORT REALISATIONS
	 */
	public PortRealisation createPortRealisation(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		PortRealisation newPortRealisation = new PortRealisation(datasetId, uri, label);
		portRealisationRepository.savePortRealisation(newPortRealisation);
		return newPortRealisation;
	}

	public PortRealisation updatePortRealisation(PortRealisationInput portRealisationInput)
			throws URISyntaxException, IOException {
		return portRealisationRepository.updateOne(portRealisationInput);
	}

	public PortRealisation deletePortRealisation(int datasetId, String uri) throws URISyntaxException, IOException {
		return portRealisationRepository.deleteOne(datasetId, uri);
	}

	/*
	 * PERFORMANCES
	 */
	public Performance createPerformance(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		Performance newPerformance = new Performance(datasetId, uri, label);
		performanceRepository.savePerformance(newPerformance);
		return newPerformance;
	}

	public Performance updatePerformance(PerformanceInput performanceInput) throws URISyntaxException, IOException {
		return performanceRepository.updateOne(performanceInput);
	}

	public Performance deletePerformance(int datasetId, String uri) throws URISyntaxException, IOException {
		return performanceRepository.deleteOne(datasetId, uri);
	}

	/*
	 * REALISATION - MODULES
	 */
	public RealisationModule createRealisationModule(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		RealisationModule newRealisationModule = new RealisationModule(datasetId, uri, label);
		realisationModuleRepository.saveRealisationModule(newRealisationModule);
		return newRealisationModule;
	}

	public RealisationModule updateRealisationModule(RealisationModuleInput realisationModuleInput)
			throws URISyntaxException, IOException {
		return realisationModuleRepository.updateOne(realisationModuleInput);
	}

	public RealisationModule deleteRealisationModule(int datasetId, String uri) throws URISyntaxException, IOException {
		return realisationModuleRepository.deleteOne(datasetId, uri);
	}

	/*
	 * REALISATION PORTS
	 */
	public RealisationPort createRealisationPort(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		RealisationPort newRealisationPort = new RealisationPort(datasetId, uri, label);
		realisationPortRepository.saveRealisationPort(newRealisationPort);
		return newRealisationPort;
	}

	public RealisationPort updateRealisationPort(RealisationPortInput realisationPortInput)
			throws URISyntaxException, IOException {
		return realisationPortRepository.updateOne(realisationPortInput);
	}

	public RealisationPort deleteRealisationPort(int datasetId, String uri) throws URISyntaxException, IOException {
		return realisationPortRepository.deleteOne(datasetId, uri);
	}

	/*
	 * REQUIREMENTS
	 */
	public Requirement createRequirement(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		Requirement newRequirement = new Requirement(datasetId, uri, label);
		requirementRepository.saveRequirement(newRequirement);
		return newRequirement;
	}

	public Requirement updateRequirement(RequirementInput requirementInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		return requirementRepository.updateOne(requirementInput, coinsObjectInput);
	}

	public Requirement deleteRequirement(int datasetId, String uri) throws URISyntaxException, IOException {
		return requirementRepository.deleteOne(datasetId, uri);
	}

	/*
	 * SYSTEM - SLOTS
	 */
	public SystemSlot createSystemSlot(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		SystemSlot newSystemSlot = new SystemSlot(datasetId, uri, label);
		systemSlotRepository.saveSystemSlot(newSystemSlot);
		return newSystemSlot;
	}

	public SystemSlot updateSystemSlot(SystemSlotInput systemSlotInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		return systemSlotRepository.updateOne(systemSlotInput, coinsObjectInput);
	}

	public SystemSlot deleteSystemSlot(int datasetId, String uri) throws URISyntaxException, IOException {
		return systemSlotRepository.deleteOne(datasetId, uri);
	}

	/*
	 * SYSTEM - INTERFACES
	 */
	public SystemInterface createSystemInterface(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		SystemInterface newSystemInterface = new SystemInterface(datasetId, uri, label);
		systemInterfaceRepository.saveSystemInterface(newSystemInterface);
		return newSystemInterface;
	}

	public SystemInterface updateSystemInterface(SystemInterfaceInput systemInterfaceInput)
			throws URISyntaxException, IOException {
		return systemInterfaceRepository.updateOne(systemInterfaceInput);
	}

	public SystemInterface deleteSystemInterface(int datasetId, String uri) throws URISyntaxException, IOException {
		return systemInterfaceRepository.deleteOne(datasetId, uri);
	}

}
