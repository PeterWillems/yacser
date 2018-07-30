package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class Hamburger {
	private int datasetId;
	private URI uri;
	private String label;
	private Hamburger assembly;
	private List<Hamburger> parts;
	private SystemSlot functionalUnit;
	private RealisationModule technicalSolution;

	public Hamburger() {
	}
	
	public Hamburger(int datasetId, String uriString, String labelString) throws URISyntaxException {
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

	public Hamburger getAssembly() {
		return assembly;
	}

	public void setAssembly(Hamburger assembly) {
		this.assembly = assembly;
	}

	public List<Hamburger> getParts() {
		return parts;
	}

	public void setParts(List<Hamburger> parts) {
		this.parts = parts;
	}

	public SystemSlot getFunctionalUnit() {
		return functionalUnit;
	}

	public void setFunctionalUnit(SystemSlot functionalUnit) {
		this.functionalUnit = functionalUnit;
	}

	public RealisationModule getTechnicalSolution() {
		return technicalSolution;
	}

	public void setTechnicalSolution(RealisationModule technicalSolution) {
		this.technicalSolution = technicalSolution;
	}


}
