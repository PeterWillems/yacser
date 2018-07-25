package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLResolver;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.FunctionRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetFunction;

@Component
public class FunctionResolver implements GraphQLResolver<Function> {
	@Autowired
	private FunctionRepository functionRepository;
	@Autowired
	private SystemInterfaceRepository systemInterfaceRepository;
	@Autowired
	private RequirementRepository requirementRepository;
	@Autowired
	private SeService seService;

	public Function getAssembly(Function function) throws URISyntaxException, IOException {
		GetFunction getFunction = seService.getFunction(function.getDatasetId(), function.getUri().getFragment());
		URI assemblyUri = getFunction.getAssembly();
		return assemblyUri != null ? functionRepository.findOne(function.getDatasetId(), assemblyUri.toString()) : null;
	}

	public List<Function> getParts(Function function) throws URISyntaxException, IOException {
		List<Function> parts = null;
		GetFunction getFunction = seService.getFunction(function.getDatasetId(), function.getUri().getFragment());
		List<URI> partUris = getFunction.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(functionRepository.findOne(function.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public SystemInterface getInput(Function function) throws URISyntaxException, IOException {
		GetFunction getFunction = seService.getFunction(function.getDatasetId(), function.getUri().getFragment());
		URI inputUri = getFunction.getInput();
		return inputUri != null ? systemInterfaceRepository.findOne(function.getDatasetId(), inputUri.toString())
				: null;
	}
	
	public SystemInterface getOutput(Function function) throws URISyntaxException, IOException {
		GetFunction getFunction = seService.getFunction(function.getDatasetId(), function.getUri().getFragment());
		URI outputUri = getFunction.getOutput();
		return outputUri != null ? systemInterfaceRepository.findOne(function.getDatasetId(), outputUri.toString())
				: null;
	}

	public List<Requirement> getRequirements(Function function) throws URISyntaxException, IOException {
		List<Requirement> requirements = null;
		GetFunction getFunction = seService.getFunction(function.getDatasetId(), function.getUri().getFragment());
		List<URI> requirementUris = getFunction.getRequirements();
		if (requirementUris != null && requirementUris.size() > 0) {
			requirements = new ArrayList<>();
			for (URI requirementUri : requirementUris) {
				requirements.add(requirementRepository.findOne(function.getDatasetId(), requirementUri.toString()));
			}
		}
		return requirements;
	}
}
