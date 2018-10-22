package nl.tno.willemsph.coins_navigator.se.model;

import java.util.List;

public class CoinsObject extends CoinsEntity {

	public CoinsObject() {
		super();
	}

	public CoinsObject(String name, String userID, String description, String creationDate,
			List<CoinsProperty> hasProperties) {
		super(name, userID, description, creationDate, hasProperties);
	}

}
