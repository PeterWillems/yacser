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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PortRealisationRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.SystemInterfaceRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetPortRealisation;

@Component
public class PortRealisationResolver implements GraphQLResolver<PortRealisation> {
	@Autowired
	private SystemInterfaceRepository systemInterfaceRepository;
	@Autowired
	private PortRealisationRepository portRealisationRepository;
	@Autowired
	private SeService seService;

	public PortRealisation getAssembly(PortRealisation portRealisation) throws URISyntaxException, IOException {
		GetPortRealisation getPortRealisation = seService.getPortRealisation(portRealisation.getDatasetId(), portRealisation.getUri().getFragment());
		URI assemblyUri = getPortRealisation.getAssembly();
		return assemblyUri != null ? portRealisationRepository.findOne(portRealisation.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<PortRealisation> getParts(PortRealisation portRealisation) throws URISyntaxException, IOException {
		List<PortRealisation> parts = null;
		GetPortRealisation getPortRealisation = seService.getPortRealisation(portRealisation.getDatasetId(), portRealisation.getUri().getFragment());
		List<URI> partUris = getPortRealisation.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(portRealisationRepository.findOne(portRealisation.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public SystemInterface getSystemInterface(PortRealisation portRealisation) throws URISyntaxException, IOException {
		GetPortRealisation getPortRealisation = seService.getPortRealisation(portRealisation.getDatasetId(), portRealisation.getUri().getFragment());
		URI systemInterfaceUri = getPortRealisation.getSystemInterface();
		return systemInterfaceUri != null
				? systemInterfaceRepository.findOne(portRealisation.getDatasetId(), systemInterfaceUri.toString())
				: null;
	}

}
