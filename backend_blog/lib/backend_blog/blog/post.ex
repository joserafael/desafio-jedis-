defmodule BackendBlog.Blog.Post do
  use Ecto.Schema
  import Ecto.Changeset

  schema "posts" do
    field :title, :string
    field :body, :string
    field :draft, :boolean, default: false
    belongs_to :user, BackendBlog.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(post, attrs) do
    post
    |> cast(attrs, [:title, :body, :draft, :user_id])
    |> validate_required([:title, :body, :draft, :user_id])
  end
end
