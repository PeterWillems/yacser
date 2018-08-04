package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;
import java.util.List;

public class SystemInterfaceInput {
	private int datasetId;
	private String uri;
	private String label;
	private String assembly;
	private List<String> parts;
	private String systemSlot0;
	private String systemSlot1;
	private List<String> requirements;

	public SystemInterfaceInput() {
	}

	public SystemInterfaceInput(int datasetId, String uriString) throws URISyntaxException {
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

	public String getSystemSlot0() {
		return systemSlot0;
	}

	public void setSystemSlot0(String systemSlot0) {
		this.systemSlot0 = systemSlot0;
	}

	public String getSystemSlot1() {
		return systemSlot1;
	}

	public void setSystemSlot1(String systemSlot1) {
		this.systemSlot1 = systemSlot1;
	}

	public List<String> getRequirements() {
		return requirements;
	}

	public void setRequirements(List<String> requirements) {
		this.requirements = requirements;
	}

}
