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
import nl.tno.willemsph.coins_navigator.se.graphql.models.CoinsPropertyInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Hamburger;
import nl.tno.willemsph.coins_navigator.se.graphql.models.HamburgerInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.CoinsProperty;
import nl.tno.willemsph.coins_navigator.se.model.GetHamburger;
import nl.tno.willemsph.coins_navigator.se.model.PutHamburger;

@Component
public class HamburgerRepository {

	@Autowired
	private SeService seService;

	public List<Hamburger> getAllHamburgers(int datasetId) throws IOException, URISyntaxException {
		List<Hamburger> hamburgers = new ArrayList<>();
		List<GetHamburger> getHamburgers = seService.getAllHamburgers(datasetId);
		for (GetHamburger getHamburger : getHamburgers) {
			Hamburger hamburger = new Hamburger(datasetId, getHamburger.getUri().toString(), getHamburger.getLabel());
			hamburgers.add(hamburger);
		}
		return hamburgers;
	}

	public void saveHamburger(Hamburger hamburger) throws URISyntaxException, IOException {
		GetHamburger getHamburger = seService.createHamburger(hamburger.getDatasetId());
		PutHamburger putHamburger = new PutHamburger();
		putHamburger.setUri(getHamburger.getUri());
		putHamburger.setLabel(getHamburger.getLabel());
		seService.updateHamburger(hamburger.getDatasetId(), getHamburger.getLocalName(), putHamburger);
		hamburger.setUri(putHamburger.getUri());
		hamburger.setLabel(putHamburger.getLabel());
	}

	public Hamburger findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetHamburger hamburger = seService.getHamburger(datasetId, localName);
		return new Hamburger(datasetId, hamburger.getUri().toString(), hamburger.getLabel());
	}

	public Hamburger updateOne(HamburgerInput hamburgerInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		URI uri = new URI(hamburgerInput.getUri());
		GetHamburger getHamburger = seService.getHamburger(hamburgerInput.getDatasetId(), uri.getFragment());
		PutHamburger putHamburger = new PutHamburger();
		putHamburger.setUri(getHamburger.getUri());
		putHamburger.setLabel(hamburgerInput.getLabel());
		if (hamburgerInput.getAssembly() != null) {
			putHamburger.setAssembly(new URI(hamburgerInput.getAssembly()));
		}
		if (hamburgerInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : hamburgerInput.getParts()) {
				parts.add(new URI(part));
			}
			putHamburger.setParts(parts);
		}
		if (hamburgerInput.getFunctionalUnit() != null) {
			putHamburger.setFunctionalUnit(new URI(hamburgerInput.getFunctionalUnit()));
		}
		if (hamburgerInput.getTechnicalSolution() != null) {
			putHamburger.setTechnicalSolution(new URI(hamburgerInput.getTechnicalSolution()));
		}
		if (hamburgerInput.getPortRealisations() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : hamburgerInput.getPortRealisations()) {
				parts.add(new URI(part));
			}
			putHamburger.setPortRealisations(parts);
		}
		if (hamburgerInput.getStartDate() != null) {
			putHamburger.setStartDate(hamburgerInput.getStartDate());
		}
		if (hamburgerInput.getEndDate() != null) {
			putHamburger.setEndDate(hamburgerInput.getEndDate());
		}
		if (coinsObjectInput != null) {
			List<CoinsProperty> hasProperties = null;
			List<CoinsPropertyInput> coinsProperties = coinsObjectInput.getHasProperties();
			if (coinsProperties != null) {
				hasProperties = new ArrayList<>();
				for (CoinsPropertyInput coinsProperty : coinsProperties) {
					CoinsProperty hasProperty = new CoinsProperty();
					hasProperty.setName(coinsProperty.getName());
					hasProperty.setType(coinsProperty.getType());
					hasProperty.setValue(coinsProperty.getValue());
					hasProperties.add(hasProperty);
				}
			}
			putHamburger.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate(), hasProperties));
		}

		GetHamburger updatedHamburger = seService.updateHamburger(hamburgerInput.getDatasetId(),
				getHamburger.getLocalName(), putHamburger);
		return new Hamburger(hamburgerInput.getDatasetId(), updatedHamburger.getUri().toString(),
				updatedHamburger.getLabel());
	}

	public Hamburger deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String hamburgerLocalName = (new URI(uri)).getFragment();
		GetHamburger getHamburger = seService.getHamburger(datasetId, hamburgerLocalName);
		Hamburger hamburger = new Hamburger(datasetId, uri, getHamburger.getLabel());
		seService.deleteHamburger(datasetId, hamburgerLocalName);
		return hamburger;
	}
}
