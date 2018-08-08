package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;

public class NumericProperty {
	private int datasetId;
	private URI uri;
	private String label;
	private Double datatypeValue;
	private URI type;
	private URI unit;

	public NumericProperty(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public Double getDatatypeValue() {
		return datatypeValue;
	}

	public void setDatatypeValue(Double datatypeValue) {
		this.datatypeValue = datatypeValue;
	}

	public URI getType() {
		return type;
	}

	public void setType(URI type) {
		this.type = type;
	}

	public URI getUnit() {
		return unit;
	}

	public void setUnit(URI unit) {
		this.unit = unit;
	}

}
