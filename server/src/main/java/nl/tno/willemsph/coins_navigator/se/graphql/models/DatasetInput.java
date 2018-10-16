package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.util.List;

public class DatasetInput {
	private int datasetId;
	private String label;
	private String uri;
	private String filepath;
	private List<String> imports;
	private String versionInfo;

	public DatasetInput() {
	}

	public DatasetInput(int datasetId, String label, String uri, String versionInfo) {
		this.datasetId = datasetId;
		this.setLabel(label);
		this.uri = uri;
		this.versionInfo = versionInfo;
	}

	public int getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(int datasetId) {
		this.datasetId = datasetId;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public List<String> getImports() {
		return imports;
	}

	public void setImports(List<String> imports) {
		this.imports = imports;
	}

	public String getVersionInfo() {
		return versionInfo;
	}

	public void setVersionInfo(String versionInfo) {
		this.versionInfo = versionInfo;
	}

}
