# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     BackendBlog.Repo.insert!(%BackendBlog.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias BackendBlog.Repo
alias BackendBlog.Blog.Post
alias BackendBlog.Accounts

# We recommend running the seeds inside a transaction, so that if
# something goes wrong, the whole operation is rolled back.
Repo.transaction(fn ->
  # It's a good practice to start by cleaning out existing posts
  # to avoid duplicates and to make the script idempotent.
  IO.puts("Deleting existing posts...")
  Repo.delete_all(Post)

  # Create a user if they don't exist
  if is_nil(Accounts.get_user_by_email("user@editor.com")) do
    IO.puts("Creating user user@editor.com...")

    {:ok, _user} =
      Accounts.create_user(%{
        email: "user@editor.com",
        password: "editor2025"
      })
  else
    IO.puts("User user@editor.com already exists, skipping.")
  end

  IO.puts("Generating 200 new posts...")

  # Get the current time to use for all timestamps.
  now = DateTime.utc_now() |> DateTime.truncate(:second)

  # Generate 200 fake posts in memory
  posts =
    Enum.map(1..200, fn _ ->
      %{
        title: Faker.Lorem.sentence(4..8),
        body: Faker.Lorem.paragraphs(2..6) |> Enum.join("\n\n"),
        draft: Enum.random([true, false]),
        inserted_at: now,
        updated_at: now
      }
    end)

  # Insert all posts at once for better performance.
  # Ecto will automatically handle the `id` and `timestamps`.
  IO.puts("Inserting posts into the database...")
  Repo.insert_all(Post, posts)
end)

IO.puts("Database seeded with 200 posts successfully.")
