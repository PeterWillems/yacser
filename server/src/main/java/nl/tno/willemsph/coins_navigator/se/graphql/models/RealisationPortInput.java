package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;
import java.util.List;

public class RealisationPortInput {
	private int datasetId;
	private String uri;
	private String label;
	private String assembly;
	private List<String> parts;
	private List<String> performances;

	public RealisationPortInput() {
	}
	
	public RealisationPortInput(int datasetId, String uriString) throws URISyntaxException {
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

	public String getAssembly() {
		return assembly;
	}

	public void setAssembly(String assembly) {
		this.assembly = assembly;
	}

	public List<String> getParts() {
		return parts;
	}

	public void setParts(List<String> parts) {
		this.parts = parts;
	}

	public List<String> getPerformances() {
		return performances;
	}

	public void setPerformances(List<String> performances) {
		this.performances = performances;
	}


}
