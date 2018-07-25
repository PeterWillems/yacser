package nl.tno.willemsph.coins_navigator.se.graphql;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;

import nl.tno.willemsph.coins_navigator.se.graphql.models.Dataset;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterface;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.DatasetRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;

@Component
public class Query implements GraphQLQueryResolver {

	private final DatasetRepository datasetRepository;
	private final FunctionRepository functionRepository;
	private final RequirementRepository requirementRepository;
	private final SystemInterfaceRepository systemInterfaceRepository;
	private final SystemSlotRepository systemSlotRepository;

	public Query(DatasetRepository datasetRepository, FunctionRepository functionRepository,
			RequirementRepository requirementRepository, SystemInterfaceRepository systemInterfaceRepository,
			SystemSlotRepository systemSlotRepository) {
		this.datasetRepository = datasetRepository;
		this.functionRepository = functionRepository;
		this.requirementRepository = requirementRepository;
		this.systemInterfaceRepository = systemInterfaceRepository;
		this.systemSlotRepository = systemSlotRepository;
	}

	public List<Dataset> allDatasets() throws URISyntaxException, IOException {
		return datasetRepository.getAllDatasets();
	}

	public List<SystemSlot> allSystemSlots(int datasetId) throws IOException, URISyntaxException {
		return systemSlotRepository.getAllSystemSlots(datasetId);
	}

	public SystemSlot oneSystemSlot(int datasetId, String uri) throws URISyntaxException, IOException {
		return systemSlotRepository.findOne(datasetId, uri);
	}

	public List<Function> allFunctions(int datasetId) throws IOException, URISyntaxException {
		return functionRepository.getAllFunctions(datasetId);
	}

	public List<Requirement> allRequirements(int datasetId) throws IOException, URISyntaxException {
		return requirementRepository.getAllRequirements(datasetId);
	}

	public List<SystemInterface> allSystemInterfaces(int datasetId) throws IOException, URISyntaxException {
		return systemInterfaceRepository.getAllSystemInterfaces(datasetId);
	}

}
