package nl.tno.willemsph.coins_navigator.se.model;

public class CoinsObject {
	private String name;
	private String userID;
	private String description;
	private String creationDate;

	public CoinsObject() {
	}

	public CoinsObject(String name, String userID, String description, String creationDate) {
		setName(name);
		setUserID(userID);
		setDescription(description);
		setCreationDate(creationDate);
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
}
