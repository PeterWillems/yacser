package nl.tno.willemsph.coins_navigator.se.graphql.models;

public class DatasetInput {
	private int datasetId;
	private String uri;
	private String versionInfo;

	public DatasetInput() {
	}

	public DatasetInput(int datasetId, String uri, String versionInfo) {
		this.datasetId = datasetId;
		this.uri = uri;
		this.versionInfo = versionInfo;
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

	public String getVersionInfo() {
		return versionInfo;
	}

	public void setVersionInfo(String versionInfo) {
		this.versionInfo = versionInfo;
	}

}
