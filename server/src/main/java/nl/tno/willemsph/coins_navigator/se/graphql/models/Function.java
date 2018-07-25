package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class Function {
	private int datasetId;
	private URI uri;
	private String label;
	private Function assembly;
	private List<Function> parts;
	private SystemInterface input;
	private SystemInterface output;
	private List<Requirement> requirements;

	public Function(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public Function getAssembly() {
		return assembly;
	}

	public void setAssembly(Function assembly) {
		this.assembly = assembly;
	}

	public List<Function> getParts() {
		return parts;
	}

	public void setParts(List<Function> parts) {
		this.parts = parts;
	}

	public SystemInterface getInput() {
		return input;
	}

	public void setInput(SystemInterface input) {
		this.input = input;
	}

	public SystemInterface getOutput() {
		return output;
	}

	public void setOutput(SystemInterface output) {
		this.output = output;
	}

	public List<Requirement> getRequirements() {
		return requirements;
	}

	public void setRequirements(List<Requirement> requirements) {
		this.requirements = requirements;
	}

}
