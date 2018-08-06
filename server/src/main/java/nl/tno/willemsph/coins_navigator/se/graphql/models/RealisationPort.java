package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;

public class RealisationPort {
	private int datasetId;
	private URI uri;
	private String label;

	public RealisationPort() {
	}

	public RealisationPort(int datasetId, String uriString, String label) throws URISyntaxException {
		setDatasetId(datasetId);
		setUri(new URI(uriString));
		setLabel(label);
	}

	public int getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(int datasetId) {
		this.datasetId = datasetId;
	}

	public URI getUri() {
		return uri;
	}

	public void setUri(URI uri) {
		this.uri = uri;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

}
