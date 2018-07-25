package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class SystemInterface {
	private int datasetId;
	private URI uri;
	private String label;
	private SystemInterface assembly;
	private List<SystemInterface> parts;
	private SystemSlot systemSlot0;
	private SystemSlot systemSlot1;
	private List<Requirement> requirements;

	public SystemInterface(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public SystemInterface getAssembly() {
		return assembly;
	}

	public void setAssembly(SystemInterface assembly) {
		this.assembly = assembly;
	}

	public List<SystemInterface> getParts() {
		return parts;
	}

	public void setParts(List<SystemInterface> parts) {
		this.parts = parts;
	}

	public SystemSlot getSystemSlot0() {
		return systemSlot0;
	}

	public void setSystemSlot0(SystemSlot systemSlot0) {
		this.systemSlot0 = systemSlot0;
	}

	public SystemSlot getSystemSlot1() {
		return systemSlot1;
	}

	public void setSystemSlot1(SystemSlot systemSlot1) {
		this.systemSlot1 = systemSlot1;
	}

	public List<Requirement> getRequirements() {
		return requirements;
	}

	public void setRequirements(List<Requirement> requirements) {
		this.requirements = requirements;
	}

}
