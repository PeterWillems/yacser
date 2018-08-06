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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PerformanceRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationPortRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationPort;

@Component
public class RealisationPortResolver implements GraphQLResolver<RealisationPort> {
	@Autowired
	private PerformanceRepository performanceRepository;
	@Autowired
	private RealisationPortRepository realisationPortRepository;
	@Autowired
	private SeService seService;

	public RealisationPort getAssembly(RealisationPort realisationPort) throws URISyntaxException, IOException {
		GetRealisationPort getRealisationPort = seService.getRealisationPort(realisationPort.getDatasetId(), realisationPort.getUri().getFragment());
		URI assemblyUri = getRealisationPort.getAssembly();
		return assemblyUri != null ? realisationPortRepository.findOne(realisationPort.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<RealisationPort> getParts(RealisationPort realisationPort) throws URISyntaxException, IOException {
		List<RealisationPort> parts = null;
		GetRealisationPort getRealisationPort = seService.getRealisationPort(realisationPort.getDatasetId(), realisationPort.getUri().getFragment());
		List<URI> partUris = getRealisationPort.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(realisationPortRepository.findOne(realisationPort.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public List<Performance> getPerformances(RealisationPort realisationPort) throws URISyntaxException, IOException {
		List<Performance> performances = null;
		GetRealisationPort getRealisationPort = seService.getRealisationPort(realisationPort.getDatasetId(), realisationPort.getUri().getFragment());
		List<URI> performanceUris = getRealisationPort.getPerformances();
		if (performanceUris != null && performanceUris.size() > 0) {
			performances = new ArrayList<>();
			for (URI performanceUri : performanceUris) {
				performances.add(performanceRepository.findOne(realisationPort.getDatasetId(), performanceUri.toString()));
			}
		}
		return performances;
	}

}
