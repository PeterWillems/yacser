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
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModule;
import nl.tno.willemsph.coins_navigator.se.graphql.models.RealisationModuleInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetRealisationModule;
import nl.tno.willemsph.coins_navigator.se.model.PutRealisationModule;

@Component
public class RealisationModuleRepository {

	@Autowired
	private SeService seService;

	public List<RealisationModule> getAllRealisationModules(int datasetId) throws IOException, URISyntaxException {
		List<RealisationModule> realisationModules = new ArrayList<>();
		List<GetRealisationModule> getRealisationModules = seService.getAllRealisationModules(datasetId);
		for (GetRealisationModule getRealisationModule : getRealisationModules) {
			RealisationModule realisationModule = new RealisationModule(datasetId,
					getRealisationModule.getUri().toString(), getRealisationModule.getLabel());
			realisationModules.add(realisationModule);
		}
		return realisationModules;
	}

	public void saveRealisationModule(RealisationModule realisationModule) throws URISyntaxException, IOException {
		GetRealisationModule getRealisationModule = seService.createRealisationModule(realisationModule.getDatasetId());
		PutRealisationModule putRealisationModule = new PutRealisationModule();
		putRealisationModule.setUri(getRealisationModule.getUri());
		putRealisationModule.setLabel(getRealisationModule.getLabel());
		seService.updateRealisationModule(realisationModule.getDatasetId(), getRealisationModule.getLocalName(),
				putRealisationModule);
		realisationModule.setUri(putRealisationModule.getUri());
		realisationModule.setLabel(putRealisationModule.getLabel());
	}

	public RealisationModule findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetRealisationModule realisationModule = seService.getRealisationModule(datasetId, localName);
		return new RealisationModule(datasetId, realisationModule.getUri().toString(), realisationModule.getLabel());
	}

	public RealisationModule updateOne(RealisationModuleInput realisationModuleInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		URI uri = new URI(realisationModuleInput.getUri());
		GetRealisationModule getRealisationModule = seService
				.getRealisationModule(realisationModuleInput.getDatasetId(), uri.getFragment());
		PutRealisationModule putRealisationModule = new PutRealisationModule();
		putRealisationModule.setUri(getRealisationModule.getUri());
		putRealisationModule.setLabel(realisationModuleInput.getLabel());
		if (realisationModuleInput.getAssembly() != null) {
			putRealisationModule.setAssembly(new URI(realisationModuleInput.getAssembly()));
		}
		if (realisationModuleInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : realisationModuleInput.getParts()) {
				parts.add(new URI(part));
			}
			putRealisationModule.setParts(parts);
		}
		if (realisationModuleInput.getPerformances() != null) {
			List<URI> performances = new ArrayList<>();
			for (String performance : realisationModuleInput.getPerformances()) {
				performances.add(new URI(performance));
			}
			putRealisationModule.setPerformances(performances);
		}
		if (realisationModuleInput.getPorts() != null) {
			List<URI> ports = new ArrayList<>();
			for (String port : realisationModuleInput.getPorts()) {
				ports.add(new URI(port));
			}
			putRealisationModule.setPorts(ports);
		}
		if (coinsObjectInput != null) {
			putRealisationModule
					.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
							coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate()));
		}

		GetRealisationModule updatedRealisationModule = seService.updateRealisationModule(
				realisationModuleInput.getDatasetId(), getRealisationModule.getLocalName(), putRealisationModule);
		return new RealisationModule(realisationModuleInput.getDatasetId(),
				updatedRealisationModule.getUri().toString(), updatedRealisationModule.getLabel());
	}

	public RealisationModule deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String realisationModuleLocalName = (new URI(uri)).getFragment();
		GetRealisationModule getRealisationModule = seService.getRealisationModule(datasetId,
				realisationModuleLocalName);
		RealisationModule realisationModule = new RealisationModule(datasetId, uri, getRealisationModule.getLabel());
		seService.deleteFunction(datasetId, realisationModuleLocalName);
		return realisationModule;
	}
}
