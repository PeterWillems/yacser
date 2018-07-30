package nl.tno.willemsph.coins_navigator.se.graphql;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;

import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.FunctionInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Hamburger;
import nl.tno.willemsph.coins_navigator.se.graphql.models.HamburgerInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Performance;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PerformanceInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModule;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModuleInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RequirementInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlotInput;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.HamburgerRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PerformanceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationModuleRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;

@Component
public class Mutation implements GraphQLMutationResolver {

	private final SystemSlotRepository systemSlotRepository;
	private final FunctionRepository functionRepository;
	private final HamburgerRepository hamburgerRepository;
	private final PerformanceRepository performanceRepository;
	private final RealisationModuleRepository realisationModuleRepository;
	private final RequirementRepository requirementRepository;

	public Mutation(SystemSlotRepository systemSlotRepository, FunctionRepository functionRepository,
			HamburgerRepository hamburgerRepository, PerformanceRepository performanceRepository,
			RealisationModuleRepository realisationModuleRepository, RequirementRepository requirementRepository) {
		this.systemSlotRepository = systemSlotRepository;
		this.functionRepository = functionRepository;
		this.hamburgerRepository = hamburgerRepository;
		this.performanceRepository = performanceRepository;
		this.realisationModuleRepository = realisationModuleRepository;
		this.requirementRepository = requirementRepository;
	}

	/*
	 * SYSTEM - SLOTS
	 */
	public SystemSlot createSystemSlot(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		SystemSlot newSystemSlot = new SystemSlot(datasetId, uri, label);
		systemSlotRepository.saveSystemSlot(newSystemSlot);
		return newSystemSlot;
	}

	public SystemSlot updateSystemSlot(SystemSlotInput systemSlot) throws URISyntaxException, IOException {
		return systemSlotRepository.updateOne(systemSlot);
	}

	public SystemSlot deleteSystemSlot(int datasetId, String uri) throws URISyntaxException, IOException {
		return systemSlotRepository.deleteOne(datasetId, uri);
	}

	/*
	 * FUNCTIONS
	 */
	public Function createFunction(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		Function newFunction = new Function(datasetId, uri, label);
		functionRepository.saveFunction(newFunction);
		return newFunction;
	}

	public Function updateFunction(FunctionInput functionInput) throws URISyntaxException, IOException {
		return functionRepository.updateOne(functionInput);
	}

	public Function deleteFunction(int datasetId, String uri) throws URISyntaxException, IOException {
		return functionRepository.deleteOne(datasetId, uri);
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
	 * REQUIREMENTS
	 */
	public Requirement createRequirement(int datasetId, String uri, String label)
			throws URISyntaxException, IOException {
		Requirement newRequirement = new Requirement(datasetId, uri, label);
		requirementRepository.saveRequirement(newRequirement);
		return newRequirement;
	}

	public Requirement updateRequirement(RequirementInput requirementInput) throws URISyntaxException, IOException {
		return requirementRepository.updateOne(requirementInput);
	}

	public Requirement deleteRequirement(int datasetId, String uri) throws URISyntaxException, IOException {
		return requirementRepository.deleteOne(datasetId, uri);
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
}
