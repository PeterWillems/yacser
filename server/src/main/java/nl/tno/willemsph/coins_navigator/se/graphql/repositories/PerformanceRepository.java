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
import nl.tno.willemsph.coins_navigator.se.graphql.models.Performance;
import nl.tno.willemsph.coins_navigator.se.graphql.models.PerformanceInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetPerformance;
import nl.tno.willemsph.coins_navigator.se.model.PutPerformance;

@Component
public class PerformanceRepository {

	@Autowired
	private SeService seService;

	public List<Performance> getAllPerformances(int datasetId) throws IOException, URISyntaxException {
		List<Performance> performances = new ArrayList<>();
		List<GetPerformance> getPerformances = seService.getAllPerformances(datasetId);
		for (GetPerformance getPerformance : getPerformances) {
			Performance performance = new Performance(datasetId, getPerformance.getUri().toString(),
					getPerformance.getLabel());
			performances.add(performance);
		}
		return performances;
	}

	public void savePerformance(Performance performance) throws URISyntaxException, IOException {
		GetPerformance getPerformance = seService.createPerformance(performance.getDatasetId());
		PutPerformance putPerformance = new PutPerformance();
		putPerformance.setUri(getPerformance.getUri());
		putPerformance.setLabel(getPerformance.getLabel());
		seService.updatePerformance(performance.getDatasetId(), getPerformance.getLocalName(), putPerformance);
		performance.setUri(putPerformance.getUri());
		performance.setLabel(putPerformance.getLabel());
	}

	public Performance findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetPerformance performance = seService.getPerformance(datasetId, localName);
		return new Performance(datasetId, performance.getUri().toString(), performance.getLabel());
	}

	public Performance updateOne(PerformanceInput performanceInput, CoinsObjectInput coinsObjectInput) throws URISyntaxException, IOException {
		URI uri = new URI(performanceInput.getUri());
		GetPerformance getPerformance = seService.getPerformance(performanceInput.getDatasetId(), uri.getFragment());
		PutPerformance putPerformance = new PutPerformance();
		putPerformance.setUri(getPerformance.getUri());
		putPerformance.setLabel(performanceInput.getLabel());
		if (performanceInput.getAssembly() != null) {
			putPerformance.setAssembly(new URI(performanceInput.getAssembly()));
		}
		if (performanceInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : performanceInput.getParts()) {
				parts.add(new URI(part));
			}
			putPerformance.setParts(parts);
		}
		if (performanceInput.getValue() != null) {
			putPerformance.setValue(new URI(performanceInput.getValue()));
		}
		if (coinsObjectInput != null) {
			putPerformance.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate()));
		}

		GetPerformance updatedPerformance = seService.updatePerformance(performanceInput.getDatasetId(),
				getPerformance.getLocalName(), putPerformance);
		return new Performance(performanceInput.getDatasetId(), updatedPerformance.getUri().toString(),
				updatedPerformance.getLabel());
	}

	public Performance deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String performanceLocalName = (new URI(uri)).getFragment();
		GetPerformance getPerformance = seService.getPerformance(datasetId, performanceLocalName);
		Performance performance = new Performance(datasetId, uri, getPerformance.getLabel());
		seService.deletePerformance(datasetId, performanceLocalName);
		return performance;
	}

}
