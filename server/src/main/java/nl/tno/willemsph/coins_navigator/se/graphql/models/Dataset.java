package nl.tno.willemsph.coins_navigator.se.graphql.models;

public class Dataset {
	private int datasetId;
	private String filepath;

	public Dataset() {
	}

	public Dataset(int datasetId, String filepath) {
		this.datasetId = datasetId;
		this.filepath = filepath;
	}

	public int getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(int datasetId) {
		this.datasetId = datasetId;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

}
