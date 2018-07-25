package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class Requirement {
	private int datasetId;
	private URI uri;
	private String label;
	private Requirement assembly;
	private List<Requirement> parts;
	private NumericProperty minValue;
	private NumericProperty maxValue;

	public Requirement(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public Requirement getAssembly() {
		return assembly;
	}

	public void setAssembly(Requirement assembly) {
		this.assembly = assembly;
	}

	public List<Requirement> getParts() {
		return parts;
	}

	public void setParts(List<Requirement> parts) {
		this.parts = parts;
	}

	public NumericProperty getMinValue() {
		return minValue;
	}

	public void setMinValue(NumericProperty minValue) {
		this.minValue = minValue;
	}

	public NumericProperty getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(NumericProperty maxValue) {
		this.maxValue = maxValue;
	}

}
