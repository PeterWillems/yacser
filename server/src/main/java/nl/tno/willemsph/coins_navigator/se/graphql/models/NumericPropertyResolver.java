package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.coxautodev.graphql.tools.GraphQLResolver;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.model.GetNumericProperty;

@Component
public class NumericPropertyResolver implements GraphQLResolver<NumericProperty> {
	@Autowired
	private SeService seService;

	public Double getDatatypeValue(NumericProperty numericProperty) throws URISyntaxException, IOException {
		GetNumericProperty getNumericProperty = seService.getNumericProperty(numericProperty.getDatasetId(),
				numericProperty.getUri().getFragment());
		return getNumericProperty.getDatatypeValue();
	}

}
