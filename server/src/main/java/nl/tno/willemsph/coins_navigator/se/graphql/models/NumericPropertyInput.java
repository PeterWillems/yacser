package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;

public class NumericPropertyInput {
	private int datasetId;
	private String uri;
	private String label;
	private Double datatypeValue;
	private String type;
	private String unit;

	public NumericPropertyInput() {
	}

	public NumericPropertyInput(int datasetId, String uriString) throws URISyntaxException {
		this.datasetId = datasetId;
		this.uri = uriString;
	}

	public int getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(int datasetId) {
		this.datasetId = datasetId;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

}
