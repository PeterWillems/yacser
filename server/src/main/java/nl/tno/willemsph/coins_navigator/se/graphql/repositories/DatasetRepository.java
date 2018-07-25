package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Dataset;

@Component
public class DatasetRepository {

	@Autowired
	private SeService seService;

	public List<Dataset> getAllDatasets() throws URISyntaxException, IOException {
		List<Dataset> datasets = new ArrayList<>();
		List<nl.tno.willemsph.coins_navigator.se.Dataset> getDatasets = seService.getAllDatasets();
		for (nl.tno.willemsph.coins_navigator.se.Dataset getDataset : getDatasets) {
			Dataset dataset = new Dataset(getDataset.getId(), getDataset.getFilepath());
			datasets.add(dataset);
		}
		return datasets;
	}
}
