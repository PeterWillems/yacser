package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationPort;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationPortInput;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationPort;
import nl.tno.willemsph.coins_navigator.se.model.PutRealisationPort;

@Component
public class RealisationPortRepository {

	@Autowired
	private SeService seService;

	public List<RealisationPort> getAllRealisationPorts(int datasetId) throws IOException, URISyntaxException {
		List<RealisationPort> realisationPorts = new ArrayList<>();
		List<GetRealisationPort> getRealisationPorts = seService.getAllRealisationPorts(datasetId);
		for (GetRealisationPort getRealisationPort : getRealisationPorts) {
			RealisationPort realisationPort = new RealisationPort(datasetId, getRealisationPort.getUri().toString(),
					getRealisationPort.getLabel());
			realisationPorts.add(realisationPort);
		}
		return realisationPorts;
	}

	public void saveRealisationPort(RealisationPort realisationPort) throws URISyntaxException, IOException {
		GetRealisationPort getRealisationPort = seService.createRealisationPort(realisationPort.getDatasetId());
		PutRealisationPort putRealisationPort = new PutRealisationPort();
		putRealisationPort.setUri(getRealisationPort.getUri());
		putRealisationPort.setLabel(getRealisationPort.getLabel());
		seService.updateRealisationPort(realisationPort.getDatasetId(), getRealisationPort.getLocalName(),
				putRealisationPort);
		realisationPort.setUri(putRealisationPort.getUri());
		realisationPort.setLabel(putRealisationPort.getLabel());
	}

	public RealisationPort findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetRealisationPort realisationPort = seService.getRealisationPort(datasetId, localName);
		return new RealisationPort(datasetId, realisationPort.getUri().toString(), realisationPort.getLabel());
	}

	public RealisationPort updateOne(RealisationPortInput realisationPortInput) throws URISyntaxException, IOException {
		URI uri = new URI(realisationPortInput.getUri());
		GetRealisationPort getRealisationPort = seService.getRealisationPort(realisationPortInput.getDatasetId(),
				uri.getFragment());
		PutRealisationPort putRealisationPort = new PutRealisationPort();
		putRealisationPort.setUri(getRealisationPort.getUri());
		putRealisationPort.setLabel(realisationPortInput.getLabel());
		if (realisationPortInput.getAssembly() != null) {
			putRealisationPort.setAssembly(new URI(realisationPortInput.getAssembly()));
		}
		if (realisationPortInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : realisationPortInput.getParts()) {
				parts.add(new URI(part));
			}
			putRealisationPort.setParts(parts);
		}
		if (realisationPortInput.getPerformances() != null) {
			List<URI> performances = new ArrayList<>();
			for (String performance : realisationPortInput.getPerformances()) {
				performances.add(new URI(performance));
			}
			putRealisationPort.setPerformances(performances);
		}

		GetRealisationPort updatedRealisationPort = seService.updateRealisationPort(realisationPortInput.getDatasetId(),
				getRealisationPort.getLocalName(), putRealisationPort);
		return new RealisationPort(realisationPortInput.getDatasetId(), updatedRealisationPort.getUri().toString(),
				updatedRealisationPort.getLabel());
	}

	public RealisationPort deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String realisationPortLocalName = (new URI(uri)).getFragment();
		GetRealisationPort getRealisationPort = seService.getRealisationPort(datasetId, realisationPortLocalName);
		RealisationPort realisationPort = new RealisationPort(datasetId, uri, getRealisationPort.getLabel());
		seService.deleteRealisationPort(datasetId, realisationPortLocalName);
		return realisationPort;
	}
}
