package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PortRealisation;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PortRealisationInput;
import nl.tno.willemsph.coins_navigator.se.model.GetPortRealisation;
import nl.tno.willemsph.coins_navigator.se.model.PutPortRealisation;

@Component
public class PortRealisationRepository {

	@Autowired
	private SeService seService;

	public List<PortRealisation> getAllPortRealisations(int datasetId) throws IOException, URISyntaxException {
		List<PortRealisation> portRealisations = new ArrayList<>();
		List<GetPortRealisation> getPortRealisations = seService.getAllPortRealisations(datasetId);
		for (GetPortRealisation getPortRealisation : getPortRealisations) {
			PortRealisation portRealisation = new PortRealisation(datasetId, getPortRealisation.getUri().toString(),
					getPortRealisation.getLabel());
			portRealisations.add(portRealisation);
		}
		return portRealisations;
	}

	public void savePortRealisation(PortRealisation portRealisation) throws URISyntaxException, IOException {
		GetPortRealisation getPortRealisation = seService.createPortRealisation(portRealisation.getDatasetId());
		PutPortRealisation putPortRealisation = new PutPortRealisation();
		putPortRealisation.setUri(getPortRealisation.getUri());
		putPortRealisation.setLabel(getPortRealisation.getLabel());
		seService.updatePortRealisation(portRealisation.getDatasetId(), getPortRealisation.getLocalName(),
				putPortRealisation);
		portRealisation.setUri(putPortRealisation.getUri());
		portRealisation.setLabel(putPortRealisation.getLabel());
	}

	public PortRealisation findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetPortRealisation portRealisation = seService.getPortRealisation(datasetId, localName);
		return new PortRealisation(datasetId, portRealisation.getUri().toString(), portRealisation.getLabel());
	}

	public PortRealisation updateOne(PortRealisationInput portRealisationInput) throws URISyntaxException, IOException {
		URI uri = new URI(portRealisationInput.getUri());
		GetPortRealisation getPortRealisation = seService.getPortRealisation(portRealisationInput.getDatasetId(),
				uri.getFragment());
		PutPortRealisation putPortRealisation = new PutPortRealisation();
		putPortRealisation.setUri(getPortRealisation.getUri());
		putPortRealisation.setLabel(portRealisationInput.getLabel());
		if (portRealisationInput.getAssembly() != null) {
			putPortRealisation.setAssembly(new URI(portRealisationInput.getAssembly()));
		}
		if (portRealisationInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : portRealisationInput.getParts()) {
				parts.add(new URI(part));
			}
			putPortRealisation.setParts(parts);
		}
		if (portRealisationInput.getSystemInterface() != null) {
			putPortRealisation.setSystemInterface(new URI(portRealisationInput.getSystemInterface()));
		}
		if (portRealisationInput.getRealisationPort() != null) {
			putPortRealisation.setRealisationPort(new URI(portRealisationInput.getRealisationPort()));
		}

		GetPortRealisation updatedPortRealisation = seService.updatePortRealisation(portRealisationInput.getDatasetId(),
				getPortRealisation.getLocalName(), putPortRealisation);
		return new PortRealisation(portRealisationInput.getDatasetId(), updatedPortRealisation.getUri().toString(),
				updatedPortRealisation.getLabel());
	}

	public PortRealisation deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String portRealisationLocalName = (new URI(uri)).getFragment();
		GetPortRealisation getPortRealisation = seService.getPortRealisation(datasetId, portRealisationLocalName);
		PortRealisation portRealisation = new PortRealisation(datasetId, uri, getPortRealisation.getLabel());
		seService.deletePortRealisation(datasetId, portRealisationLocalName);
		return portRealisation;
	}
}
