package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Dataset;
import nl.tno.willemsph.coins_navigator.se.graphql.models.DatasetInput;

@Component
public class DatasetRepository {

	@Autowired
	private SeService seService;

	public List<Dataset> getAllDatasets() throws URISyntaxException, IOException {
		List<Dataset> datasets = new ArrayList<>();
		List<nl.tno.willemsph.coins_navigator.se.Dataset> getDatasets = seService.getAllDatasets();
		for (nl.tno.willemsph.coins_navigator.se.Dataset getDataset : getDatasets) {
			Dataset dataset = new Dataset(getDataset.getId(), getDataset.getFilepath(), getDataset.getUri(),
					getDataset.getOntologyUri(), getDataset.getImports(), getDataset.getVersionInfo());
			datasets.add(dataset);
		}
		return datasets;
	}

	public Dataset updateOne(DatasetInput datasetInput) throws URISyntaxException, IOException {
		URI uri = new URI(datasetInput.getUri());

		seService.updateDataset(datasetInput.getDatasetId(), uri, datasetInput.getVersionInfo());
		nl.tno.willemsph.coins_navigator.se.Dataset getDataset = seService.getDataset(datasetInput.getDatasetId());
		return new Dataset(getDataset.getId(), getDataset.getFilepath(), getDataset.getUri(),
				getDataset.getOntologyUri(), getDataset.getImports(), getDataset.getVersionInfo());
	}

	public Integer save(int datasetId) throws FileNotFoundException, URISyntaxException, IOException {
		nl.tno.willemsph.coins_navigator.se.Dataset saveDataset = seService.saveDataset(datasetId);
		return saveDataset != null ? saveDataset.getId() : null;
	}
}
