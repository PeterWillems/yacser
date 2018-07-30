package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class RealisationModule {
	private int datasetId;
	private URI uri;
	private String label;
	private RealisationModule assembly;
	private List<RealisationModule> parts;

	public RealisationModule() {
	}
	
	public RealisationModule(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public RealisationModule getAssembly() {
		return assembly;
	}

	public void setAssembly(RealisationModule assembly) {
		this.assembly = assembly;
	}

	public List<RealisationModule> getParts() {
		return parts;
	}

	public void setParts(List<RealisationModule> parts) {
		this.parts = parts;
	}

}
