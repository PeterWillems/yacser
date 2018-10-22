package nl.tno.willemsph.coins_navigator.se.model;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class CoinsProperty extends CoinsEntity {
	private URI type;
	private Object value;

	public CoinsProperty() {
		super();
	}

	public CoinsProperty(String name, String userID, String description, String creationDate,
			List<CoinsProperty> hasProperties) {
		super(name, userID, description, creationDate, hasProperties);
	}

	public URI getType() {
		return type;
	}

	public void setType(URI type) {
		this.type = type;
	}

	public Object getValue() throws URISyntaxException {
		switch (type.getFragment()) {
		case "BooleanProperty":
			return new Boolean((String) value);
		case "DateTimeProperty":
			return new String((String) value);
		case "DocumentProperty":
			return new URI((String) value);
		case "FloatProperty":
			return new Float((String) value);
		case "IntegerProperty":
			return new Integer((String) value);
		case "StringProperty":
			return new String((String) value);
		case "UriProperty":
			return new String((String) value);
		}
		return null;
	}

	public void setValue(Object value) {
		this.value = value;
	}

}
