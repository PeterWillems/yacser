package nl.tno.willemsph.coins_navigator.se.graphql;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;

import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.FunctionInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlot;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemSlotInput;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;

@Component
public class Mutation implements GraphQLMutationResolver {

	private final SystemSlotRepository systemSlotRepository;
	private final FunctionRepository functionRepository;

	public Mutation(SystemSlotRepository systemSlotRepository, FunctionRepository functionRepository) {
		this.systemSlotRepository = systemSlotRepository;
		this.functionRepository = functionRepository;
	}

	public SystemSlot createSystemSlot(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		SystemSlot newSystemSlot = new SystemSlot(datasetId, uri, label);
		systemSlotRepository.saveSystemSlot(newSystemSlot);
		return newSystemSlot;
	}

	public SystemSlot updateSystemSlot(SystemSlotInput systemSlot) throws URISyntaxException, IOException {
		return systemSlotRepository.updateOne(systemSlot);
	}

	public Function createFunction(int datasetId, String uri, String label) throws URISyntaxException, IOException {
		Function newFunction = new Function(datasetId, uri, label);
		functionRepository.saveFunction(newFunction);
		return newFunction;
	}
	
	public Function updateFunction(FunctionInput functionInput) throws URISyntaxException, IOException {
		return functionRepository.updateOne(functionInput);
	}
}
