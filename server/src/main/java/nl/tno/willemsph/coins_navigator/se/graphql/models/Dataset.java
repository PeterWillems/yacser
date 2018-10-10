package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class Dataset {
	private int datasetId;
	private String filepath;
	private String uri;
	private String ontologyUri;
	private List<String> imports;
	private String versionInfo;

	public Dataset() {
	}

	public Dataset(int datasetId, String filepath, URI uri, URI ontologyUri, List<URI> imports, String versionInfo) {
		this.datasetId = datasetId;
		this.filepath = filepath;
		this.uri = uri != null ? uri.toString() : null;
		this.ontologyUri = ontologyUri != null ? ontologyUri.toString() : null;
		if (imports != null) {
			this.imports = new ArrayList<>();
			for (URI importUri : imports) {
				this.imports.add(importUri.toString());
			}
		}
		this.versionInfo = versionInfo;
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

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getOntologyUri() {
		return ontologyUri;
	}

	public void setOntologyUri(String ontologyUri) {
		this.ontologyUri = ontologyUri;
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
