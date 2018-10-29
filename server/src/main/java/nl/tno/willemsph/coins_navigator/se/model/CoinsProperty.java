package nl.tno.willemsph.coins_navigator.se.model;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

public class CoinsProperty extends CoinsEntity {
	private URI type;
	private String propertyRsrcType;
	private String valueRsrcType;
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

	public String getPropertyRsrcType() {
		return propertyRsrcType;
	}

	public void setPropertyRsrcType(String propertyRsrcType) {
		this.propertyRsrcType = propertyRsrcType;
	}

	public String getValueRsrcType() {
		return valueRsrcType;
	}

	public void setValueRsrcType(String valueRsrcType) {
		this.valueRsrcType = valueRsrcType;
	}

	public Object getValue() throws URISyntaxException {
		switch (type.getFragment()) {
		case "BooleanProperty":
			return new Boolean((String) value);
		case "DateTimeProperty":
			return new String((String) value);
		case "DocumentProperty":
			return value != null ? new URI((String) value) : null;
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
