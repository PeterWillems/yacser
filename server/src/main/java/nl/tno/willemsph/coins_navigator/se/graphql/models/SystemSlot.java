package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;

public class SystemSlot {
	private int datasetId;
	private URI uri;
	private String label;
//	private Optional<SystemSlot> assembly;
//	private List<SystemSlot> parts;
//	private List<Function> functions;
//	private List<Requirement> requirements;
//	private List<Hamburger> hamburgers;

	public SystemSlot(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

//	public Optional<SystemSlot> getAssembly() {
//		return assembly;
//	}
//
//	public void setAssembly(Optional<SystemSlot> assembly) {
//		this.assembly = assembly;
//	}
//
//	public List<SystemSlot> getParts() {
//		return parts;
//	}
//
//	public void setParts(List<SystemSlot> parts) {
//		this.parts = parts;
//	}
//
//	public List<Function> getFunctions() {
//		return functions;
//	}
//
//	public void setFunctions(List<Function> functions) {
//		this.functions = functions;
//	}
//
//	public List<Requirement> getRequirements() {
//		return requirements;
//	}
//
//	public void setRequirements(List<Requirement> requirements) {
//		this.requirements = requirements;
//	}
//
//	public List<Hamburger> getHamburgers() {
//		return hamburgers;
//	}
//
//	public void setHamburgers(List<Hamburger> hamburgers) {
//		this.hamburgers = hamburgers;
//	}

}
