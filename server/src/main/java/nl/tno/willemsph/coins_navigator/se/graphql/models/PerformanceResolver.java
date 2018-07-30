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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.NumericPropertyRepository;
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.PerformanceRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetPerformance;

@Component
public class PerformanceResolver implements GraphQLResolver<Performance> {
	@Autowired
	private PerformanceRepository performanceRepository;
	@Autowired
	private NumericPropertyRepository numericPropertyRepository;
	@Autowired
	private SeService seService;

	public Performance getAssembly(Performance performance) throws URISyntaxException, IOException {
		GetPerformance getPerformance = seService.getPerformance(performance.getDatasetId(),
				performance.getUri().getFragment());
		URI assemblyUri = getPerformance.getAssembly();
		return assemblyUri != null ? performanceRepository.findOne(performance.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<Performance> getParts(Performance performance) throws URISyntaxException, IOException {
		List<Performance> parts = null;
		GetPerformance getPerformance = seService.getPerformance(performance.getDatasetId(),
				performance.getUri().getFragment());
		List<URI> partUris = getPerformance.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(performanceRepository.findOne(performance.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}

	public NumericProperty getValue(Performance performance) throws URISyntaxException, IOException {
		GetPerformance getPerformance = seService.getPerformance(performance.getDatasetId(),
				performance.getUri().getFragment());
		URI valueUri = getPerformance.getValue();
		return valueUri != null
				? numericPropertyRepository.findOne(performance.getDatasetId(), valueUri.toString())
				: null;
	}

}
