import { Select, Button, Avatar, Badge } from "antd";
const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 9.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }
  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="title"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="desc"
              cols="7"
              rows="7"
              value={values.desc}
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={values.prices}
                  onChange={(v) => setValues({ ...values, paid: v, prices: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid === "paid" && (
              <div className="form-group">
                <Select
                  defaultValue="$9.99"
                  style={{ widht: "100%" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[,]}
                  size="large"
                >
                  {children}
                </Select>
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="outlines"
              className="form-control"
              placeholder="Category"
              value={values.outlines}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {values.image !== '' && (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <img style={{width:'140px', }} src={values.image} />
              </Badge>
            )}

            {editPage && values.image && (
              <Avatar width={200} src={values.image.Location} />
            )}
          </div>

          <div className="row">
            <div className="col">
              <button
                type='submit'
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                loading={values.loading}
                
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
