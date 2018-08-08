package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;
import java.util.List;

public class PortRealisationInput {
	private int datasetId;
	private String uri;
	private String label;
	private String assembly;
	private List<String> parts;
	private String _interface;
	private String port;

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

	public String getInterface() {
		return _interface;
	}

	public void setInterface(String _interface) {
		this._interface = _interface;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

}
