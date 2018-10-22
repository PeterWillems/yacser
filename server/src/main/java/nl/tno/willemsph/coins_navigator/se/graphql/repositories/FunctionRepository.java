package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.CoinsObjectInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Function;
import nl.tno.willemsph.coins_navigator.se.graphql.models.FunctionInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetFunction;
import nl.tno.willemsph.coins_navigator.se.model.PutFunction;

@Component
public class FunctionRepository {

	@Autowired
	private SeService seService;

	public List<Function> getAllFunctions(int datasetId) throws IOException, URISyntaxException {
		List<Function> functions = new ArrayList<>();
		List<GetFunction> getFunctions = seService.getAllFunctions(datasetId);
		for (GetFunction getFunction : getFunctions) {
			Function function = new Function(datasetId, getFunction.getUri().toString(), getFunction.getLabel());
			functions.add(function);
		}
		return functions;
	}

	public void saveFunction(Function function) throws URISyntaxException, IOException {
		GetFunction getFunction = seService.createFunction(function.getDatasetId());
		PutFunction putFunction = new PutFunction();
		putFunction.setUri(getFunction.getUri());
		putFunction.setLabel(getFunction.getLabel());
		seService.updateFunction(function.getDatasetId(), getFunction.getLocalName(), putFunction);
		function.setUri(putFunction.getUri());
		function.setLabel(putFunction.getLabel());
	}

	public Function findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetFunction function = seService.getFunction(datasetId, localName);
		return new Function(datasetId, function.getUri().toString(), function.getLabel());
	}

	public Function updateOne(FunctionInput functionInput, CoinsObjectInput coinsObjectInput) throws URISyntaxException, IOException {
		URI uri = new URI(functionInput.getUri());
		GetFunction getFunction = seService.getFunction(functionInput.getDatasetId(), uri.getFragment());
		PutFunction putFunction = new PutFunction();
		putFunction.setUri(getFunction.getUri());
		putFunction.setLabel(functionInput.getLabel());
		if (functionInput.getAssembly() != null) {
			putFunction.setAssembly(new URI(functionInput.getAssembly()));
		}
		if (functionInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : functionInput.getParts()) {
				parts.add(new URI(part));
			}
			putFunction.setParts(parts);
		}
		if (functionInput.getRequirements() != null) {
			List<URI> requirements = new ArrayList<>();
			for (String requirement : functionInput.getRequirements()) {
				requirements.add(new URI(requirement));
			}
			putFunction.setRequirements(requirements);
		}
		if (functionInput.getInput() != null) {
			putFunction.setInput(new URI(functionInput.getInput()));
		}
		if (functionInput.getOutput() != null) {
			putFunction.setOutput(new URI(functionInput.getOutput()));
		}
		if (coinsObjectInput != null) {
			putFunction.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate(), null));
		}

		GetFunction updatedFunction = seService.updateFunction(functionInput.getDatasetId(), getFunction.getLocalName(),
				putFunction);
		return new Function(functionInput.getDatasetId(), updatedFunction.getUri().toString(),
				updatedFunction.getLabel());
	}

	public Function deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String functionLocalName = (new URI(uri)).getFragment();
		GetFunction getFunction = seService.getFunction(datasetId, functionLocalName);
		Function function = new Function(datasetId, uri, getFunction.getLabel());
		seService.deleteFunction(datasetId, functionLocalName);
		return function;
	}
}
