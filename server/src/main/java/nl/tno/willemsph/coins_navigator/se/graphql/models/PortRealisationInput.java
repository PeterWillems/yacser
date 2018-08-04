package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;
import java.util.List;

public class PortRealisationInput {
	private int datasetId;
	private String uri;
	private String label;
	private String assembly;
	private List<String> parts;
	private String systemInterface;
	private String realisationPort;

	public PortRealisationInput() {
	}
	
	public PortRealisationInput(int datasetId, String uriString) throws URISyntaxException {
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

	public String getSystemInterface() {
		return systemInterface;
	}

	public void setSystemInterface(String systemInterface) {
		this.systemInterface = systemInterface;
	}

	public String getRealisationPort() {
		return realisationPort;
	}

	public void setRealisationPort(String realisationPort) {
		this.realisationPort = realisationPort;
	}

}
