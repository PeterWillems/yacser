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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RequirementRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemSlotRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemInterface;

@Component
public class SystemInterfaceResolver implements GraphQLResolver<SystemInterface> {
	@Autowired
	private SystemInterfaceRepository systemInterfaceRepository;
	@Autowired
	private SystemSlotRepository systemSlotRepository;
	@Autowired
	private RequirementRepository requirementRepository;
	@Autowired
	private SeService seService;

	public SystemInterface getAssembly(SystemInterface systemInterface) throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = seService.getSystemInterface(systemInterface.getDatasetId(),
				systemInterface.getUri().getFragment());
		URI assemblyUri = getSystemInterface.getAssembly();
		return assemblyUri != null
				? systemInterfaceRepository.findOne(systemInterface.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<SystemInterface> getParts(SystemInterface systemInterface) throws URISyntaxException, IOException {
		List<SystemInterface> parts = null;
		GetSystemInterface getSystemInterface = seService.getSystemInterface(systemInterface.getDatasetId(),
				systemInterface.getUri().getFragment());
		List<URI> partUris = getSystemInterface.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(systemInterfaceRepository.findOne(systemInterface.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public SystemSlot getSystemSlot0(SystemInterface systemInterface) throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = seService.getSystemInterface(systemInterface.getDatasetId(),
				systemInterface.getUri().getFragment());
		URI systemSlot0Uri = getSystemInterface.getSystemSlot0();
		return systemSlot0Uri != null
				? systemSlotRepository.findOne(systemInterface.getDatasetId(), systemSlot0Uri.toString())
				: null;
	}

	public SystemSlot getSystemSlot1(SystemInterface systemInterface) throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = seService.getSystemInterface(systemInterface.getDatasetId(),
				systemInterface.getUri().getFragment());
		URI systemSlot1Uri = getSystemInterface.getSystemSlot1();
		return systemSlot1Uri != null
				? systemSlotRepository.findOne(systemInterface.getDatasetId(), systemSlot1Uri.toString())
				: null;
	}

	public List<Requirement> getRequirements(SystemInterface systemInterface) throws URISyntaxException, IOException {
		List<Requirement> requirements = null;
		GetSystemInterface getSystemInterfacen = seService.getSystemInterface(systemInterface.getDatasetId(),
				systemInterface.getUri().getFragment());
		List<URI> requirementUris = getSystemInterfacen.getRequirements();
		if (requirementUris != null && requirementUris.size() > 0) {
			requirements = new ArrayList<>();
			for (URI requirementUri : requirementUris) {
				requirements
						.add(requirementRepository.findOne(systemInterface.getDatasetId(), requirementUri.toString()));
			}
		}
		return requirements;
	}
}
