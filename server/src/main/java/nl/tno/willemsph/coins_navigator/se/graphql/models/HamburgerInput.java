package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.net.URISyntaxException;
import java.util.List;

public class HamburgerInput {
	private int datasetId;
	private String uri;
	private String label;
	private String assembly;
	private List<String> parts;
	private String functionalUnit;
	private String technicalSolution;
	private List<String> portRealisations;
	private String startDate;
	private String endDate;

	public HamburgerInput() {
	}
	
	public HamburgerInput(int datasetId, String uriString) throws URISyntaxException {
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

	public String getFunctionalUnit() {
		return functionalUnit;
	}

	public void setFunctionalUnit(String functionalUnit) {
		this.functionalUnit = functionalUnit;
	}

	public String getTechnicalSolution() {
		return technicalSolution;
	}

	public void setTechnicalSolution(String technicalSolution) {
		this.technicalSolution = technicalSolution;
	}

	public List<String> getPortRealisations() {
		return portRealisations;
	}

	public void setPortRealisations(List<String> portRealisations) {
		this.portRealisations = portRealisations;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}


}
