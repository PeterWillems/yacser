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
import nl.tno.willemsph.coins_navigator.se.graphql.repositories.RealisationModuleRepository;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationModule;

@Component
public class RealisationModuleResolver implements GraphQLResolver<RealisationModule> {
	@Autowired
	private RealisationModuleRepository realisationModuleRepository;
	@Autowired
	private PerformanceRepository performanceRepository;
	@Autowired
	private SeService seService;

	public RealisationModule getAssembly(RealisationModule realisationModule) throws URISyntaxException, IOException {
		GetRealisationModule getRealisationModule = seService.getRealisationModule(realisationModule.getDatasetId(),
				realisationModule.getUri().getFragment());
		URI assemblyUri = getRealisationModule.getAssembly();
		return assemblyUri != null
				? realisationModuleRepository.findOne(realisationModule.getDatasetId(), assemblyUri.toString())
				: null;
	}

	public List<RealisationModule> getParts(RealisationModule realisationModule)
			throws URISyntaxException, IOException {
		List<RealisationModule> parts = null;
		GetRealisationModule getRealisationModule = seService.getRealisationModule(realisationModule.getDatasetId(),
				realisationModule.getUri().getFragment());
		List<URI> partUris = getRealisationModule.getParts();
		if (partUris != null && partUris.size() > 0) {
			parts = new ArrayList<>();
			for (URI partUri : partUris) {
				parts.add(realisationModuleRepository.findOne(realisationModule.getDatasetId(), partUri.toString()));
			}
		}
		return parts;
	}
	
	public List<Performance> getPerformances(RealisationModule realisationModule) throws URISyntaxException, IOException {
		List<Performance> performances = null;
		GetRealisationModule getRealisationModule = seService.getRealisationModule(realisationModule.getDatasetId(),
				realisationModule.getUri().getFragment());
		List<URI> performanceUris = getRealisationModule.getPerformances();
		if (performanceUris != null && performanceUris.size() > 0) {
			performances = new ArrayList<>();
			for (URI requirementUri : performanceUris) {
				performances.add(performanceRepository.findOne(realisationModule.getDatasetId(), requirementUri.toString()));
			}
		}
		return performances;
	}
}
