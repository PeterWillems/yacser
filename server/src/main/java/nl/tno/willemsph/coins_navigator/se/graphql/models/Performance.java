package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class Performance {
	private int datasetId;
	private URI uri;
	private String label;
	private Performance assembly;
	private List<Performance> parts;
	private NumericProperty value;

	public Performance(int datasetId, String uriString, String labelString) throws URISyntaxException {
		this.datasetId = datasetId;
		this.uri = new URI(uriString);
		this.label = labelString;
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

	public Performance getAssembly() {
		return assembly;
	}

	public void setAssembly(Performance assembly) {
		this.assembly = assembly;
	}

	public List<Performance> getParts() {
		return parts;
	}

	public void setParts(List<Performance> parts) {
		this.parts = parts;
	}

	public NumericProperty getValue() {
		return value;
	}

	public void setValue(NumericProperty value) {
		this.value = value;
	}

}
