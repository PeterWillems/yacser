package nl.tno.willemsph.coins_navigator.se.graphql.models;

import java.util.List;

public class CoinsObject {
	private String name;
	private String userID;
	private String description;
	private String creationDate;
	private List<CoinsProperty> hasProperties;

	public CoinsObject() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}

	public List<CoinsProperty> getHasProperties() {
		return hasProperties;
	}

	public void setHasProperties(List<CoinsProperty> hasProperties) {
		this.hasProperties = hasProperties;
	}

}
