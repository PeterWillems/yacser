package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.NumericProperty;
import nl.tno.willemsph.coins_navigator.se.graphql.models.NumericPropertyInput;
import nl.tno.willemsph.coins_navigator.se.model.GetNumericProperty;
import nl.tno.willemsph.coins_navigator.se.model.PutNumericProperty;

@Component
public class NumericPropertyRepository {

	@Autowired
	private SeService seService;

	public List<NumericProperty> getAllNumericProperties(int datasetId) throws IOException, URISyntaxException {
		List<NumericProperty> numericProperties = new ArrayList<>();
		List<GetNumericProperty> getNumericProperties = seService.getAllNumericProperties(datasetId);
		for (GetNumericProperty getNumericProperty : getNumericProperties) {
			NumericProperty numericProperty = new NumericProperty(datasetId, getNumericProperty.getUri().toString(),
					getNumericProperty.getLabel());
			numericProperties.add(numericProperty);
		}
		return numericProperties;
	}

	public void saveNumericProperty(NumericProperty numericProperty) throws URISyntaxException, IOException {
		GetNumericProperty getNumericProperty = seService.createNumericProperty(numericProperty.getDatasetId());
		PutNumericProperty putNumericProperty = new PutNumericProperty();
		putNumericProperty.setUri(getNumericProperty.getUri());
		putNumericProperty.setLabel(getNumericProperty.getLabel());
		seService.updateNumericProperty(numericProperty.getDatasetId(), getNumericProperty.getLocalName(),
				putNumericProperty);
		numericProperty.setUri(putNumericProperty.getUri());
		numericProperty.setLabel(putNumericProperty.getLabel());
		numericProperty.setDatatypeValue(getNumericProperty.getDatatypeValue());
	}

	public NumericProperty findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetNumericProperty getNumericProperty = seService.getNumericProperty(datasetId, localName);
		return new NumericProperty(datasetId, getNumericProperty.getUri().toString(), getNumericProperty.getLabel());
	}

	public NumericProperty updateOne(NumericPropertyInput numericPropertyInput) throws URISyntaxException, IOException {
		URI uri = new URI(numericPropertyInput.getUri());
		GetNumericProperty getNumericProperty = seService.getNumericProperty(numericPropertyInput.getDatasetId(),
				uri.getFragment());
		PutNumericProperty putNumericProperty = new PutNumericProperty();
		putNumericProperty.setUri(getNumericProperty.getUri());
		putNumericProperty.setLabel(numericPropertyInput.getLabel());

		if (numericPropertyInput.getDatatypeValue() != null) {
			putNumericProperty.setDatatypeValue(numericPropertyInput.getDatatypeValue());
		}

		GetNumericProperty updatedNumericProperty = seService.updateNumericProperty(numericPropertyInput.getDatasetId(),
				getNumericProperty.getLocalName(), putNumericProperty);
		return new NumericProperty(numericPropertyInput.getDatasetId(), updatedNumericProperty.getUri().toString(),
				updatedNumericProperty.getLabel());
	}

	public NumericProperty deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String numericPropertyLocalName = (new URI(uri)).getFragment();
		GetNumericProperty getNumericProperty = seService.getNumericProperty(datasetId, numericPropertyLocalName);
		NumericProperty numericProperty = new NumericProperty(datasetId, uri, getNumericProperty.getLabel());
		seService.deleteNumericProperty(datasetId, numericPropertyLocalName);
		return numericProperty;
	}

}
